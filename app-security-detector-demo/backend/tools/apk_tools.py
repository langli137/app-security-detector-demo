"""
APK 工具模块

提供 APK 文件的高级解析能力：
1. 使用 apktool 解码 APK（获取完整 AndroidManifest.xml、资源文件）
2. 使用 jadx 反编译 DEX 为 Java 源码
3. 基础 AXML 二进制解析（apktool 不可用时的降级方案）
4. Smali 文件扫描

工具非必须：如果 apktool / jadx 未安装，自动降级为 ZIP 文本抽取模式。
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from tools.gateway import ToolGateway


# ========== 工具检测 ==========

def find_tool(name: str) -> Optional[str]:
    """查找工具可执行文件路径"""
    path = shutil.which(name)
    if path:
        return path
    # 常见安装位置
    candidates = [
        Path.home() / f"{name}.bat",
        Path.home() / f"{name}.cmd",
        Path("C:\\tools") / f"{name}.bat",
        Path("C:\\Program Files") / name / f"{name}.bat",
    ]
    for c in candidates:
        if c.exists():
            return str(c)
    return None


def get_apktool_path() -> Optional[str]:
    return find_tool("apktool") or find_tool("apktool.bat")


def get_jadx_path() -> Optional[str]:
    return find_tool("jadx") or find_tool("jadx.bat") or find_tool("jadx-gui")


# ========== APK 解码（apktool） ==========

def decode_apk(apk_path: str, output_dir: Optional[str] = None) -> Dict[str, any]:
    """
    使用 apktool 解码 APK

    Returns:
        {
            "success": bool,
            "output_dir": str,
            "manifest_path": str,
            "smali_dir": str,
            "resources_dir": str,
            "error": str (if failed)
        }
    """
    apktool = get_apktool_path()
    if not apktool:
        return {"success": False, "error": "apktool 未安装，使用 ZIP 降级模式"}

    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="apktool_")

    try:
        result = subprocess.run(
            [apktool, "d", apk_path, "-o", output_dir, "-f", "--no-res"],
            capture_output=True, text=True, timeout=300
        )
        if result.returncode != 0:
            return {"success": False, "error": f"apktool 失败: {result.stderr[:200]}"}

        out = Path(output_dir)
        manifest = out / "AndroidManifest.xml"
        smali_dir = out / "smali"
        return {
            "success": True,
            "output_dir": str(out),
            "manifest_path": str(manifest) if manifest.exists() else "",
            "smali_dir": str(smali_dir) if smali_dir.exists() else "",
            "resources_dir": str(out / "res") if (out / "res").exists() else "",
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "apktool 解码超时"}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ========== DEX 反编译（jadx） ==========

def decompile_apk(apk_path: str, output_dir: Optional[str] = None) -> Dict[str, any]:
    """
    使用 jadx 反编译 APK 为 Java 源码

    Returns:
        {
            "success": bool,
            "output_dir": str,
            "java_sources": [str],
            "error": str (if failed)
        }
    """
    jadx = get_jadx_path()
    if not jadx:
        return {"success": False, "error": "jadx 未安装，使用 ZIP 降级模式"}

    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="jadx_")

    try:
        result = subprocess.run(
            [jadx, "-d", output_dir, apk_path],
            capture_output=True, text=True, timeout=600
        )
        if result.returncode != 0:
            return {"success": False, "error": f"jadx 失败: {result.stderr[:200]}"}

        java_files = []
        for f in Path(output_dir).rglob("*.java"):
            java_files.append(str(f))
        return {
            "success": True,
            "output_dir": str(output_dir),
            "java_sources": java_files,
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "jadx 反编译超时"}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ========== 基础 AXML 解析器 ==========

def parse_axml_basic(data: bytes) -> str:
    """
    极简 AXML 二进制解析器

    尝试从 AndroidManifest.xml 二进制格式中提取可读文本。
    这是 apktool 不可用时的降级方案。
    """
    try:
        text = data.decode("utf-8", errors="ignore")
        if "<?xml" in text or "<manifest" in text:
            return text
    except Exception:
        pass

    # 提取 AXML 中的字符串池
    strings = []
    i = 0
    while i < len(data) - 4:
        # 查找 UTF-16 字符串
        if data[i:i+2] == b'\x00\x00':
            i += 2
            continue
        try:
            chunk = data[i:i+256]
            # 尝试 UTF-16 LE 解码
            text = chunk.decode("utf-16-le", errors="ignore")
            clean = "".join(c for c in text if c.isprintable() or c in "._-:/")
            if len(clean) > 2 and any(kw in clean.lower() for kw in [
                "permission", "activity", "service", "receiver", "provider",
                "debuggable", "cleartext", "exported", "application",
                "android", "manifest"
            ]):
                strings.append(clean)
        except Exception:
            pass
        i += 2

    return "\n".join(strings) if strings else ""


# ========== Smali 文件扫描 ==========

def scan_smali_directory(smali_dir: str, max_files: int = 2000) -> List[Tuple[str, str]]:
    """
    扫描 Smali 目录，返回 (文件路径, 文本内容) 列表
    """
    results = []
    smali_path = Path(smali_dir)
    if not smali_path.exists():
        return results
    for f in sorted(smali_path.rglob("*.smali"))[:max_files]:
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
            results.append((str(f.relative_to(smali_path)), text))
        except Exception:
            continue
    return results


# ========== 统一 APK 解析入口 ==========

def analyze_apk(apk_path: str, use_apktool: bool = True, use_jadx: bool = True) -> Dict[str, any]:
    """
    统一 APK 分析入口

    优先使用 apktool/jadx 进行深度解析，
    如果工具不可用，降级为 ZIP 文本抽取。

    Args:
        apk_path: APK 文件路径
        use_apktool: 是否尝试使用 apktool
        use_jadx: 是否尝试使用 jadx

    Returns:
        {
            "engine": "apktool" | "jadx" | "zip",
            "files": [{"name": str, "content": str, "source": str}],
            "tools_used": [str],
            "error": str (optional)
        }
    """
    files = []
    tools_used = []

    # 尝试 apktool
    if use_apktool:
        apktool_result = decode_apk(apk_path)
        if apktool_result.get("success"):
            tools_used.append("apktool")
            out_dir = Path(apktool_result["output_dir"])

            # 读取解码后的 manifest
            manifest_path = apktool_result.get("manifest_path", "")
            if manifest_path and Path(manifest_path).exists():
                text = Path(manifest_path).read_text(encoding="utf-8", errors="ignore")
                files.append({"name": "AndroidManifest.xml", "content": text, "source": "apktool"})

            # 读取资源文件
            res_dir = apktool_result.get("resources_dir", "")
            if res_dir and Path(res_dir).exists():
                for f in Path(res_dir).rglob("*.xml"):
                    try:
                        text = f.read_text(encoding="utf-8", errors="ignore")
                        files.append({"name": f"res/{f.name}", "content": text, "source": "apktool"})
                    except Exception:
                        continue

            # 扫描 smali 文件
            smali_dir = apktool_result.get("smali_dir", "")
            if smali_dir:
                for name, text in scan_smali_directory(smali_dir):
                    files.append({"name": f"smali/{name}", "content": text, "source": "apktool"})

            return {"engine": "apktool", "files": files, "tools_used": tools_used}

    # 尝试 jadx
    if use_jadx:
        jadx_result = decompile_apk(apk_path)
        if jadx_result.get("success"):
            tools_used.append("jadx")
            for java_path in jadx_result.get("java_sources", []):
                try:
                    text = Path(java_path).read_text(encoding="utf-8", errors="ignore")
                    rel = str(Path(java_path).relative_to(jadx_result["output_dir"]))
                    files.append({"name": f"java/{rel}", "content": text, "source": "jadx"})
                except Exception:
                    continue
            return {"engine": "jadx", "files": files, "tools_used": tools_used}

    # 降级：ZIP 文本抽取
    tools_used.append("zip_fallback")
    zip_files = []
    try:
        with zipfile.ZipFile(apk_path) as zf:
            for info in zf.infolist()[:5000]:
                if info.is_dir() or info.file_size > 2 * 1024 * 1024:
                    continue
                ext = Path(info.filename).suffix.lower()
                if ext and ext not in _get_text_exts():
                    continue
                try:
                    data = zf.read(info.filename)
                    text = data.decode("utf-8", errors="ignore")
                    if text.strip():
                        zip_files.append({"name": info.filename, "content": text, "source": "zip"})
                except Exception:
                    continue
    except Exception as e:
        return {"engine": "error", "files": [], "tools_used": [], "error": str(e)}

    return {"engine": "zip", "files": zip_files, "tools_used": tools_used}


def _get_text_exts() -> set:
    return {
        ".txt", ".xml", ".json", ".properties", ".gradle", ".kt", ".java",
        ".smali", ".js", ".html", ".md", ".yml", ".yaml", ".cfg", ".ini",
        ".proto", ".aidl"
   }


# ========== 工具注册函数 ==========

def register_apk_tools(gateway: ToolGateway):
    """将 APK 工具注册到工具网关"""
    gateway.register("analyze_apk", analyze_apk, "统一 APK 解析入口（apktool/jadx/zip降级）", "apk")
    gateway.register("decode_apk", decode_apk, "apktool 解码 APK", "apk")
    gateway.register("decompile_apk", decompile_apk, "jadx 反编译 APK", "apk")
    gateway.register("parse_axml_basic", parse_axml_basic, "基础 AXML 解析", "apk")
    gateway.register("scan_smali_directory", scan_smali_directory, "扫描 Smali 目录", "apk")
    gateway.register("get_apktool_path", get_apktool_path, "获取 apktool 路径", "apk")
    gateway.register("get_jadx_path", get_jadx_path, "获取 jadx 路径", "apk")
