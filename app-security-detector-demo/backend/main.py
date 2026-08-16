from __future__ import annotations

import hashlib
import hmac
import html
import json
import re
import secrets
import sqlite3
import time
import uuid
import zipfile
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

import httpx
import yaml
from fastapi import BackgroundTasks, FastAPI, File, HTTPException, Query, UploadFile, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse

# 多 Agent 分析模块
from agents.team_leader import TeamLeader
from tools.gateway import ToolGateway
from tools import manifest_tools, code_tools, risk_tools, fix_tools

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
REPORT_DIR = BASE_DIR / "reports"
DB_PATH = BASE_DIR / "app.db"
RULES_PATH = BASE_DIR / "rules.yaml"

UPLOAD_DIR.mkdir(exist_ok=True)
REPORT_DIR.mkdir(exist_ok=True)

MAX_UPLOAD_SIZE = 50 * 1024 * 1024
MAX_SCAN_TEXT_SIZE = 2 * 1024 * 1024
TEXT_EXTS = {
    ".txt", ".xml", ".json", ".properties", ".gradle", ".kt", ".java",
    ".smali", ".js", ".html", ".md", ".yml", ".yaml", ".cfg", ".ini"
}

# ========== 数据库初始化 ==========

def _init_db():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT UNIQUE NOT NULL,
            user_id TEXT DEFAULT '',
            filename TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            progress INTEGER DEFAULT 0,
            stage TEXT DEFAULT '任务已创建',
            message TEXT DEFAULT '等待扫描',
            score INTEGER,
            risk_level TEXT,
            error TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            password_salt TEXT NOT NULL,
            nickname TEXT DEFAULT '',
            token TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS ai_analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT NOT NULL,
            analysis TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    return conn

db = _init_db()

# ========== 加载规则配置 ==========

def _load_rules() -> dict:
    if RULES_PATH.exists():
        with open(RULES_PATH, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {"rules": [], "scoring": {}}

RULES_CONFIG = _load_rules()
SCANNING_RULES = RULES_CONFIG.get("rules", [])
SCORING = RULES_CONFIG.get("scoring", {})

# ========== FastAPI 应用 ==========

app = FastAPI(title="中文版移动应用安全检测 Demo", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== 数据模型 ==========

@dataclass
class Finding:
    rule_id: str
    name: str
    severity: str
    category: str
    file: str
    line: int
    evidence: str
    description: str
    suggestion: str

# ========== 数据库操作 ==========

def _task_to_dict(row: sqlite3.Row) -> dict:
    return {
        "task_id": row["task_id"],
        "filename": row["filename"],
        "status": row["status"],
        "progress": row["progress"],
        "stage": row["stage"],
        "message": row["message"],
        "score": row["score"],
        "risk_level": row["risk_level"],
        "error": row["error"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }

def db_create_task(task_id: str, filename: str, user_id: str = ""):
    ts = _now()
    db.execute(
        "INSERT INTO tasks (task_id, user_id, filename, status, progress, stage, message, created_at, updated_at) VALUES (?, ?, ?, 'pending', 10, '文件上传完成', '检测任务已创建', ?, ?)",
        (task_id, user_id, filename, ts, ts)
    )
    db.commit()

def db_get_task(task_id: str) -> Optional[dict]:
    row = db.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,)).fetchone()
    return _task_to_dict(row) if row else None

def db_list_tasks(limit: int = 20, user_id: str = "") -> List[dict]:
    if user_id:
        rows = db.execute("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT ?", (user_id, limit)).fetchall()
    else:
        rows = db.execute("SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    return [_task_to_dict(r) for r in rows]

def db_update_task(task_id: str, **kwargs):
    allowed = {"status", "progress", "stage", "message", "score", "risk_level", "error"}
    sets = []
    vals = []
    for k, v in kwargs.items():
        if k in allowed:
            sets.append(f"{k} = ?")
            vals.append(v)
    if not sets:
        return
    sets.append("updated_at = ?")
    vals.append(_now())
    vals.append(task_id)
    db.execute(f"UPDATE tasks SET {', '.join(sets)} WHERE task_id = ?", vals)
    db.commit()

# ========== 工具函数 ==========

def _now() -> str:
    return datetime.now().isoformat(timespec="seconds")

# ========== 用户认证 ==========

def _hash_pw(password: str, salt: str) -> str:
    """使用 HMAC-SHA256 + 随机盐哈希密码"""
    return hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest()

def _gen_salt() -> str:
    return secrets.token_hex(16)

def _gen_token() -> str:
    return secrets.token_hex(32)

def auth_register(username: str, password: str, nickname: str = "") -> dict:
    existing = db.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
    if existing:
        raise HTTPException(status_code=409, detail="用户名已存在")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    salt = _gen_salt()
    token = _gen_token()
    ts = _now()
    db.execute(
        "INSERT INTO users (user_id, username, password_hash, password_salt, nickname, token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (user_id, username, _hash_pw(password, salt), salt, nickname, token, ts, ts)
    )
    db.commit()
    return {"user_id": user_id, "username": username, "nickname": nickname, "token": token}

def auth_login(username: str, password: str) -> dict:
    row = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if not row or row["password_hash"] != _hash_pw(password, row["password_salt"]):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    token = _gen_token()
    ts = _now()
    db.execute("UPDATE users SET token = ?, updated_at = ? WHERE user_id = ?", (token, ts, row["user_id"]))
    db.commit()
    return {"user_id": row["user_id"], "username": row["username"], "nickname": row["nickname"], "token": token}

def auth_verify(token: str) -> Optional[str]:
    if not token:
        return None
    row = db.execute("SELECT user_id FROM users WHERE token = ?", (token,)).fetchone()
    return row["user_id"] if row else None

def auth_logout(token: str):
    db.execute("UPDATE users SET token = '' WHERE token = ?", (token,))
    db.commit()

# ========== AI 大模型分析 ==========

AI_API_URL = "https://api.openai.com/v1/chat/completions"
AI_API_KEY = ""  # 用户可在环境变量或配置中设置
AI_MODEL = "gpt-3.5-turbo"

def ai_analyze(task_id: str, report: dict) -> dict:
    """调用 AI 大模型对检测报告进行深度分析，返回风险评估和整改建议。"""
    findings_text = json.dumps(report.get("findings", []), ensure_ascii=False, indent=2)
    prompt = f"""你是一位资深移动安全专家。请对以下 Android 应用安全检测报告进行深度分析。

检测评分：{report.get('score', 'N/A')} 分
风险等级：{report.get('risk_level', 'N/A')}
发现数量：{len(report.get('findings', []))} 项

风险详情：
{findings_text}

请从以下维度输出 JSON 格式的分析结果：
1. risk_assessment: 整体风险评估（200字以内）
2. key_issues: 最关键的 3 个问题及影响
3. fix_guide: 按优先级排列的修复步骤
4. code_examples: 针对前 2 个高危问题给出可直接使用的修复代码示例

输出格式：
{{
  "risk_assessment": "...",
  "key_issues": [{{"issue": "...", "impact": "..."}}],
  "fix_guide": [{{"priority": 1, "step": "...", "detail": "..."}}],
  "code_examples": [{{"for": "问题名称", "before": "...", "after": "..."}}]
}}"""

    ai_result = None
    if AI_API_KEY:
        try:
            resp = httpx.post(
                AI_API_URL,
                headers={"Authorization": f"Bearer {AI_API_KEY}", "Content-Type": "application/json"},
                json={"model": AI_MODEL, "messages": [{"role": "user", "content": prompt}], "temperature": 0.3},
                timeout=60
            )
            if resp.status_code == 200:
                content = resp.json()["choices"][0]["message"]["content"]
                # Strip markdown code fences if present
                content = re.sub(r'^```(?:json)?\s*', '', content.strip())
                content = re.sub(r'\s*```$', '', content.strip())
                ai_result = json.loads(content)
        except Exception as e:
            print(f"[AI] analysis error: {e}")

    if not ai_result:
        # 无 API Key 时使用规则引擎生成的默认分析
        findings = report.get("findings", [])
        high_items = [f for f in findings if f.get("severity") == "High"]
        ai_result = {
            "risk_assessment": f"经静态规则扫描，共发现 {len(findings)} 项风险（高危 {len(high_items)} 项）。建议优先处理高危问题，修复后重新扫描验证。",
            "key_issues": [
                {"issue": f.get("name", "未知风险"), "impact": f.get("description", "")}
                for f in high_items[:3]
            ] or [{"issue": "未发现高危风险", "impact": "建议关注中危项，持续改进安全基线。"}],
            "fix_guide": [
                {"priority": i + 1, "step": f.get("name", ""), "detail": f.get("suggestion", "")}
                for i, f in enumerate(findings[:5])
            ],
            "code_examples": []
        }

    # 保存到数据库
    ts = _now()
    db.execute("INSERT INTO ai_analyses (task_id, analysis, created_at) VALUES (?, ?, ?)",
               (task_id, json.dumps(ai_result, ensure_ascii=False), ts))
    db.commit()
    return ai_result

def safe_filename(name: str) -> str:
    name = Path(name).name
    name = re.sub(r"[^A-Za-z0-9._\-\u4e00-\u9fa5]", "_", name)
    return name or "upload.bin"

def file_hashes(path: Path) -> dict:
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            md5.update(chunk)
            sha256.update(chunk)
    return {"md5": md5.hexdigest(), "sha256": sha256.hexdigest()}

def mask_secret(text: str) -> str:
    text = text.strip().replace("\t", " ")
    if len(text) <= 16:
        return text
    return text[:80].replace("=", "= ")[:100]

def _severity_deduct(severity: str) -> int:
    return SCORING.get("severity_deduction", {}).get(severity, 0)

def _risk_level(score: int) -> str:
    for level in SCORING.get("risk_levels", []):
        if score >= level.get("min", 0):
            return level.get("label", "未知")
    return "高风险"

def line_no(text: str, pos: int) -> int:
    return text.count("\n", 0, max(0, pos)) + 1

def add_finding(findings: List[Finding], rule: dict, filename: str, line: int, evidence: str):
    findings.append(Finding(
        rule_id=rule["id"],
        name=rule["name"],
        severity=rule["severity"],
        category=rule["category"],
        file=filename,
        line=line,
        evidence=mask_secret(evidence),
        description=rule["description"],
        suggestion=rule["suggestion"],
    ))

# ========== 可配置规则引擎 ==========

def _compile_flags(flags_str: Optional[str]) -> int:
    flag_map = {"IGNORECASE": re.IGNORECASE, "MULTILINE": re.MULTILINE, "DOTALL": re.DOTALL}
    f = 0
    if flags_str:
        for name in flags_str.split(","):
            f |= flag_map.get(name.strip(), 0)
    return f

def scan_text(filename: str, text: str) -> List[Finding]:
    findings: List[Finding] = []

    for rule in SCANNING_RULES:
        rule_type = rule.get("type", "regex")

        if rule_type == "regex":
            pattern = rule.get("pattern", "")
            flags = _compile_flags(rule.get("flags"))
            for match in re.finditer(pattern, text, flags):
                add_finding(findings, rule, filename, line_no(text, match.start()), match.group(0))

        elif rule_type == "keyword":
            kw = rule.get("keyword", "")
            if kw and kw in text:
                idx = text.find(kw)
                add_finding(findings, rule, filename, line_no(text, idx), kw)

        elif rule_type == "keyword_list":
            for kw in rule.get("keywords", []):
                idx = text.find(kw)
                if idx >= 0:
                    add_finding(findings, rule, filename, line_no(text, idx), kw)

        elif rule_type == "keyword_all":
            keywords = rule.get("keywords", [])
            if keywords and all(kw in text for kw in keywords):
                evidence = " + ".join(keywords)
                add_finding(findings, rule, filename, 1, evidence)

    return findings

# ========== 文件扫描 ==========

def iter_scan_targets(path: Path):
    """
    返回 (文件名, 文本内容) 供扫描。

    APK 文件优先使用 apktool/jadx 进行深度解析（如果可用），
    否则降级为 ZIP 文本抽取。
    """
    is_apk = path.suffix.lower() == ".apk" or _zip_contains_apk(path)

    if is_apk:
        # APK 专用解析：优先 apktool/jadx
        try:
            from tools.apk_tools import analyze_apk
            result = analyze_apk(str(path))
            if result.get("files"):
                for f in result["files"]:
                    yield f["name"], f["content"]
                return
        except Exception:
            pass  # 降级到 ZIP 抽取

    # 通用 ZIP / 文本文件
    if zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as zf:
            for info in zf.infolist()[:5000]:
                if info.is_dir() or info.file_size > MAX_SCAN_TEXT_SIZE:
                    continue
                ext = Path(info.filename).suffix.lower()
                if ext and ext not in TEXT_EXTS and "Manifest" not in info.filename:
                    continue
                try:
                    data = zf.read(info.filename)
                    text = data.decode("utf-8", errors="ignore")
                    if text.strip():
                        yield info.filename, text
                except Exception:
                    continue
    else:
        data = path.read_bytes()[:MAX_SCAN_TEXT_SIZE]
        text = data.decode("utf-8", errors="ignore")
        yield path.name, text


def _zip_contains_apk(path: Path) -> bool:
    """快速判断 ZIP 是否包含 AndroidManifest.xml（可能是 APK）"""
    try:
        with zipfile.ZipFile(path) as zf:
            return any("AndroidManifest.xml" in n for n in zf.namelist())
    except Exception:
        return False

def scan_file(task_id: str, path: Path, original_name: str) -> dict:
    db_update_task(task_id, status="running", progress=25, stage="正在解析文件", message="正在读取文件基础信息")
    time.sleep(0.3)
    hashes = file_hashes(path)
    findings: List[Finding] = []

    if path.stat().st_size == 0:
        findings.append(Finding(
            rule_id="FILE_001", name="上传文件为空", severity="Low", category="文件检查",
            file=original_name, line=1, evidence="empty file",
            description="上传文件为空，无法进行有效检测。",
            suggestion="请上传有效 APK 或源码 ZIP。"
        ))

    db_update_task(task_id, progress=45, stage="正在执行静态规则", message="正在扫描明文地址、密钥、权限和 WebView 风险")
    scanned_files = 0
    for fname, text in iter_scan_targets(path):
        scanned_files += 1
        findings.extend(scan_text(fname, text))
        if scanned_files % 10 == 0:
            db_update_task(task_id, progress=min(80, 45 + scanned_files // 10), message=f"已扫描 {scanned_files} 个文件")

    db_update_task(task_id, progress=85, stage="正在计算评分", message="正在汇总风险等级")
    rule_count: Dict[str, int] = {}
    deduction = 0
    for f in findings:
        max_ded = 5  # 默认每规则最多扣5次
        c = rule_count.get(f.rule_id, 0)
        if c < max_ded:
            deduction += _severity_deduct(f.severity)
        rule_count[f.rule_id] = c + 1
    base_score = SCORING.get("base_score", 100)
    score = max(0, base_score - deduction)
    summary = {
        "critical": sum(1 for f in findings if f.severity == "Critical"),
        "high": sum(1 for f in findings if f.severity == "High"),
        "medium": sum(1 for f in findings if f.severity == "Medium"),
        "low": sum(1 for f in findings if f.severity == "Low"),
        "info": sum(1 for f in findings if f.severity == "Info"),
    }
    report = {
        "task_id": task_id,
        "filename": original_name,
        "generated_at": _now(),
        "score": score,
        "risk_level": _risk_level(score),
        "summary": summary,
        "app_info": {
            "filename": original_name,
            "size_bytes": path.stat().st_size,
            "md5": hashes["md5"],
            "sha256": hashes["sha256"],
            "scanned_files": scanned_files,
        },
        "engine": "rules",
        "findings": [asdict(f) for f in findings],
        "disclaimer": "本报告由演示级静态规则生成，仅用于课程、毕设或原型演示，不能替代专业安全产品和人工审计。",
    }
    return report

# ========== HTML 报告渲染 ==========

def render_html(report: dict) -> str:
    rows = []
    for f in report["findings"]:
        rows.append(f"""
        <tr>
          <td>{html.escape(f['severity'])}</td>
          <td>{html.escape(f['name'])}</td>
          <td>{html.escape(f['category'])}</td>
          <td>{html.escape(f['file'])}:{f['line']}</td>
          <td><code>{html.escape(f['evidence'])}</code></td>
          <td>{html.escape(f['suggestion'])}</td>
        </tr>
        """)
    if not rows:
        rows.append("<tr><td colspan='6'>未发现明显风险。</td></tr>")
    s = report["summary"]

    # AI 深度分析区域
    ai_section = ""
    ai = report.get("ai_analysis")
    if ai:
        ai_section = f"""
        <div class="card">
          <h2>🤖 AI 深度分析</h2>
          <p style="margin:8px 0;color:#334155"><b>整体评估：</b>{html.escape(ai.get('risk_assessment', ''))}</p>
        """
        key_issues = ai.get("key_issues", [])
        if key_issues:
            ai_section += "<h3 style='margin:12px 0 8px'>关键问题</h3>"
            for iss in key_issues:
                ai_section += f"<div style='padding:8px;border-left:3px solid #dc2626;margin:4px 0;background:#fef2f2'><b>{html.escape(iss.get('issue',''))}</b><br/>{html.escape(iss.get('impact',''))}</div>"
        fix_guide = ai.get("fix_guide", [])
        if fix_guide:
            ai_section += "<h3 style='margin:12px 0 8px'>修复步骤</h3><ol>"
            for step in fix_guide:
                ai_section += f"<li style='margin:4px 0'><b>{step.get('priority','')}.</b> {html.escape(step.get('step',''))}"
                detail = step.get("detail", "")
                if detail:
                    ai_section += f" — {html.escape(detail)}"
                ai_section += "</li>"
            ai_section += "</ol>"
        code_examples = ai.get("code_examples", [])
        if code_examples:
            ai_section += "<h3 style='margin:12px 0 8px'>修复代码示例</h3>"
            for ex in code_examples:
                ai_section += f"<div style='margin:8px 0'><b>{html.escape(ex.get('for',''))}</b>"
                before = ex.get("before", "")
                after = ex.get("after", "")
                if before:
                    ai_section += f"<br/><code style='color:#dc2626'>Before: {html.escape(before)}</code>"
                if after:
                    ai_section += f"<br/><code style='color:#16a34a'>After: {html.escape(after)}</code>"
                ai_section += "</div>"
        ai_section += "</div>"

    # Agent 执行详情
    agent_section = ""
    agent_details = report.get("agent_details", {})
    if agent_details:
        agent_section = """
        <div class="card">
          <h2>多 Agent 分析详情</h2>
          <table>
            <thead><tr><th>Agent</th><th>发现数</th><th>耗时(ms)</th><th>状态</th></tr></thead>
            <tbody>
        """
        for name, detail in agent_details.items():
            errors = detail.get("errors", [])
            status = "⚠️ 异常" if errors else "✅ 正常"
            agent_section += f"<tr><td>{html.escape(name)}</td><td>{detail.get('finding_count', 0)}</td><td>{detail.get('execution_time_ms', 0):.1f}</td><td>{status}</td></tr>"
        agent_section += "</tbody></table></div>"

    # 合规检查清单
    checklist_section = ""
    remediation = report.get("remediation", {})
    checklist = remediation.get("compliance_checklist", [])
    if checklist:
        checklist_section = """
        <div class="card">
          <h2>上架合规检查清单</h2>
          <table>
            <thead><tr><th>检查项</th><th>要求</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
        """
        for item in checklist:
            status_color = "#16a34a" if item.get("status") == "通过" else "#ca8a04"
            checklist_section += f"<tr><td>{html.escape(item.get('item',''))}</td><td>{html.escape(item.get('requirement',''))}</td><td style='color:{status_color};font-weight:600'>{html.escape(item.get('status',''))}</td><td>{html.escape(item.get('action',''))}</td></tr>"
        checklist_section += "</tbody></table></div>"

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <title>移动应用安全检测报告</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 32px; color: #222; }}
    .card {{ border: 1px solid #ddd; border-radius: 12px; padding: 16px; margin: 16px 0; }}
    .score {{ font-size: 42px; font-weight: 700; color: #0f766e; }}
    table {{ border-collapse: collapse; width: 100%; }}
    th, td {{ border: 1px solid #ddd; padding: 8px; vertical-align: top; }}
    th {{ background: #f8fafc; }}
    code {{ word-break: break-all; }}
    h2 {{ font-size: 18px; margin: 0 0 12px; }}
    h3 {{ font-size: 15px; margin: 0 0 8px; color: #475569; }}
  </style>
</head>
<body>
  <h1>移动应用安全检测报告</h1>
  <div class="card">
    <p><b>任务编号：</b>{html.escape(report['task_id'])}</p>
    <p><b>文件名：</b>{html.escape(report['filename'])}</p>
    <p><b>生成时间：</b>{html.escape(report['generated_at'])}</p>
    <p><b>SHA256：</b>{html.escape(report['app_info']['sha256'])}</p>
  </div>
  <div class="card">
    <div class="score">{report['score']} 分</div>
    <p><b>整体等级：</b>{html.escape(report['risk_level'])}</p>
    <p>高危：{s.get('high', s.get('High', 0))}，中危：{s.get('medium', s.get('Medium', 0))}，低危：{s.get('low', s.get('Low', 0))}，信息：{s.get('info', s.get('Info', 0))}</p>
  </div>

  {ai_section}
  {agent_section}
  {checklist_section}

  <h2>风险详情</h2>
  <table>
    <thead><tr><th>等级</th><th>风险名称</th><th>类别</th><th>位置</th><th>证据</th><th>修复建议</th></tr></thead>
    <tbody>{''.join(rows)}</tbody>
  </table>
  <p style="margin-top:24px;color:#666;">{html.escape(report['disclaimer'])}</p>
</body>
</html>"""

# ========== 后台扫描任务 ==========

def run_scan(task_id: str, path: Path, original_name: str):
    try:
        report = scan_file(task_id, path, original_name)
        db_update_task(task_id, progress=95, stage="正在生成报告", message="正在生成 JSON 和 HTML 报告")
        (REPORT_DIR / f"{task_id}.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        (REPORT_DIR / f"{task_id}.html").write_text(render_html(report), encoding="utf-8")
        db_update_task(task_id, status="success", progress=100, stage="检测完成", message="报告已生成",
                       score=report["score"], risk_level=report["risk_level"])
        # 自动触发 AI 分析
        try:
            ai_analyze(task_id, report)
            db_update_task(task_id, message="AI 深度分析已完成")
        except Exception as e:
            print(f"[AI] auto-analyze failed: {e}")
    except Exception as e:
        db_update_task(task_id, status="failed", progress=100, stage="检测失败", message="扫描过程中发生异常", error=str(e))


# ========== 多 Agent 分析流水线 ==========

def _build_tool_gateway() -> ToolGateway:
    """构建工具网关并注册所有工具函数"""
    gateway = ToolGateway()
    gateway.register("parse_manifest_permissions", manifest_tools.parse_manifest_permissions, "解析 Manifest 权限", "manifest")
    gateway.register("check_debuggable", manifest_tools.check_debuggable, "检查 Debug 模式", "manifest")
    gateway.register("check_cleartext", manifest_tools.check_cleartext, "检查明文流量", "manifest")
    gateway.register("check_sensitive_permissions", manifest_tools.check_sensitive_permissions, "检查敏感权限", "manifest")
    gateway.register("grep_pattern", code_tools.grep_pattern, "正则搜索", "code")
    gateway.register("find_keyword", code_tools.find_keyword, "关键字搜索", "code")
    gateway.register("find_keyword_all", code_tools.find_keyword_all, "关键字全匹配", "code")
    gateway.register("scan_secrets", code_tools.scan_secrets, "扫描密钥", "code")
    gateway.register("scan_http_urls", code_tools.scan_http_urls, "扫描 HTTP 地址", "code")
    gateway.register("calculate_score", risk_tools.calculate_score, "计算评分", "risk")
    gateway.register("determine_risk_level", risk_tools.determine_risk_level, "确定风险等级", "risk")
    gateway.register("severity_distribution", risk_tools.severity_distribution, "严重程度分布", "risk")
    gateway.register("get_fix_example", fix_tools.get_fix_example, "获取修复代码示例", "fix")
    gateway.register("generate_fix_guide", fix_tools.generate_fix_guide, "生成修复指南", "fix")
    gateway.register("generate_compliance_checklist", fix_tools.generate_compliance_checklist, "生成合规检查清单", "fix")
    # APK 深度解析工具
    from tools.apk_tools import register_apk_tools
    register_apk_tools(gateway)
    return gateway


def run_scan_agent(task_id: str, path: Path, original_name: str):
    """使用多 Agent 流水线执行安全分析"""
    try:
        # 阶段 1：文件解析
        db_update_task(task_id, status="running", progress=15, stage="正在解析文件", message="Agent 分析引擎启动")
        time.sleep(0.2)
        hashes = file_hashes(path)

        # 构建文件上下文
        files = []
        for fname, text in iter_scan_targets(path):
            files.append({"name": fname, "content": text})

        if not files:
            raise ValueError("未能从文件中提取到可分析内容")

        # 阶段 2：Agent 分析
        db_update_task(task_id, progress=30, stage="Agent 并行分析", message="Manifest/Code/WebView/Crypto Agent 并行分析中")
        time.sleep(0.2)

        context = {
            "task_id": task_id,
            "files": files,
            "rules": RULES_CONFIG.get("rules", []),
            "scoring": RULES_CONFIG.get("scoring", {}),
            "app_info": {
                "filename": original_name,
                "size_bytes": path.stat().st_size,
                "md5": hashes["md5"],
                "sha256": hashes["sha256"],
            }
        }

        # 构建 TeamLeader 和工具网关
        gateway = _build_tool_gateway()
        leader = TeamLeader(rules_config=RULES_CONFIG, db_conn=db)
        leader.register_tools(gateway.get_tools_dict())

        db_update_task(task_id, progress=50, stage="Agent 分析中", message="6 个 Agent 正在执行分析流水线")

        # 执行多 Agent 流水线
        agent_report = leader.run_pipeline(context)

        # 阶段 3：评分与报告
        db_update_task(task_id, progress=85, stage="正在生成报告", message="正在聚合 Agent 分析结果")

        risk_assessment = agent_report.get("risk_assessment", {})
        score = risk_assessment.get("score", 0)
        risk_level = risk_assessment.get("risk_level", "未知")

        # 构建兼容旧格式的报告
        report = {
            "task_id": task_id,
            "filename": original_name,
            "engine": "multi-agent",
            "generated_at": _now(),
            "score": score,
            "risk_level": risk_level,
            "summary": {
                "critical": risk_assessment.get("severity_distribution", {}).get("Critical", 0),
                "high": risk_assessment.get("severity_distribution", {}).get("High", 0),
                "medium": risk_assessment.get("severity_distribution", {}).get("Medium", 0),
                "low": risk_assessment.get("severity_distribution", {}).get("Low", 0),
                "info": risk_assessment.get("severity_distribution", {}).get("Info", 0),
            },
            "app_info": {
                "filename": original_name,
                "size_bytes": path.stat().st_size,
                "md5": hashes["md5"],
                "sha256": hashes["sha256"],
                "scanned_files": len(files),
            },
            "findings": agent_report.get("findings", []),
            "agent_details": agent_report.get("agent_details", {}),
            "remediation": agent_report.get("remediation", {}),
            "disclaimer": "本报告由多 Agent 安全分析引擎生成，用于课程、毕设或原型演示。",
        }

        (REPORT_DIR / f"{task_id}.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        (REPORT_DIR / f"{task_id}.html").write_text(render_html(report), encoding="utf-8")

        db_update_task(task_id, status="success", progress=100, stage="Agent 分析完成", message="多 Agent 分析报告已生成",
                       score=score, risk_level=risk_level)

        # 自动触发 AI 深度分析
        try:
            ai_analyze(task_id, report)
            db_update_task(task_id, message="AI 深度分析已完成")
        except Exception as e:
            print(f"[AI] auto-analyze failed: {e}")

    except Exception as e:
        db_update_task(task_id, status="failed", progress=100, stage="Agent 分析失败", message="多 Agent 分析过程中发生异常", error=str(e))

# ========== API 路由 ==========

@app.get("/", response_class=HTMLResponse)
def index():
    return _WEB_INDEX

@app.get("/health")
def health():
    return {"status": "ok", "message": "移动应用安全检测 Demo 后端运行正常", "version": "0.3.0"}

# ========== 系统信息 API ==========

@app.get("/api/system/tools")
def system_tools():
    """获取分析工具可用状态"""
    apktool = get_apktool_path()
    jadx = get_jadx_path()
    return {
        "apktool": {
            "available": apktool is not None,
            "path": apktool or "",
            "description": "APK 解码工具（提取 manifest、资源、smali）",
        },
        "jadx": {
            "available": jadx is not None,
            "path": jadx or "",
            "description": "DEX 反编译工具（生成 Java 源码）",
        },
        "rules_count": len(SCANNING_RULES),
        "agents_count": 6,
        "scan_modes": ["rules", "agent"],
    }

@app.get("/api/system/rules")
def system_rules():
    """获取所有扫描规则列表"""
    rules_summary = []
    for r in SCANNING_RULES:
        rules_summary.append({
            "id": r.get("id"),
            "name": r.get("name"),
            "severity": r.get("severity"),
            "category": r.get("category"),
            "type": r.get("type"),
        })
    return {"rules": rules_summary, "total": len(rules_summary)}

# ========== 认证 API ==========

@app.post("/api/auth/register")
def register(data: dict):
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    nickname = data.get("nickname", "").strip()
    if not username or len(username) < 2:
        raise HTTPException(status_code=400, detail="用户名至少 2 个字符")
    if not password or len(password) < 6:
        raise HTTPException(status_code=400, detail="密码至少 6 个字符")
    return auth_register(username, password, nickname)

@app.post("/api/auth/login")
def login(data: dict):
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    if not username or not password:
        raise HTTPException(status_code=400, detail="用户名和密码不能为空")
    return auth_login(username, password)

@app.post("/api/auth/logout")
def logout(authorization: str = Header("")):
    token = authorization.replace("Bearer ", "").strip()
    auth_logout(token)
    return {"status": "ok"}

@app.get("/api/auth/me")
def me(authorization: str = Header("")):
    token = authorization.replace("Bearer ", "").strip()
    user_id = auth_verify(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="未登录或 Token 已过期")
    row = db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
    return {"user_id": row["user_id"], "username": row["username"], "nickname": row["nickname"]}

# ========== 上传 API ==========

@app.post("/api/upload")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...), authorization: str = Header(""), engine: str = Query("rules")):
    token = authorization.replace("Bearer ", "").strip()
    user_id = auth_verify(token) or ""
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="文件为空")
    if len(data) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="文件超过 50MB 演示限制")

    task_id = f"task_{uuid.uuid4().hex[:12]}"
    filename = safe_filename(file.filename or "upload.bin")
    save_path = UPLOAD_DIR / f"{task_id}_{filename}"
    save_path.write_bytes(data)

    db_create_task(task_id, filename, user_id)

    # 根据 engine 参数选择扫描引擎
    if engine == "agent":
        db_update_task(task_id, message="多 Agent 分析引擎已启动")
        background_tasks.add_task(run_scan_agent, task_id, save_path, filename)
    else:
        background_tasks.add_task(run_scan, task_id, save_path, filename)

    return {"task_id": task_id, "filename": filename, "status": "pending", "engine": engine, "message": "文件上传成功，检测任务已创建"}

@app.post("/api/upload/batch")
async def batch_upload(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    authorization: str = Header(""),
    engine: str = Query("rules"),
):
    """
    批量上传并扫描多个文件（CI/CD 接口）

    返回格式:
    {
        "batch_id": "batch_xxx",
        "total": 3,
        "tasks": [
            {"task_id": "task_xxx", "filename": "a.apk", "status": "pending"},
            ...
        ]
    }
    """
    token = authorization.replace("Bearer ", "").strip()
    user_id = auth_verify(token) or ""
    batch_id = f"batch_{uuid.uuid4().hex[:8]}"
    tasks = []

    for file in files:
        data = await file.read()
        if not data or len(data) > MAX_UPLOAD_SIZE:
            continue
        task_id = f"task_{uuid.uuid4().hex[:12]}"
        filename = safe_filename(file.filename or "upload.bin")
        save_path = UPLOAD_DIR / f"{task_id}_{filename}"
        save_path.write_bytes(data)
        db_create_task(task_id, filename, user_id)
        if engine == "agent":
            db_update_task(task_id, message="多 Agent 分析引擎已启动")
            background_tasks.add_task(run_scan_agent, task_id, save_path, filename)
        else:
            background_tasks.add_task(run_scan, task_id, save_path, filename)
        tasks.append({"task_id": task_id, "filename": filename, "status": "pending"})

    return {"batch_id": batch_id, "total": len(tasks), "tasks": tasks, "engine": engine}

@app.get("/api/tasks/{task_id}")
def get_task(task_id: str):
    task = db_get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    return task

@app.get("/api/tasks")
def list_tasks(limit: int = 20, authorization: str = Header("")):
    token = authorization.replace("Bearer ", "").strip()
    user_id = auth_verify(token) or ""
    return db_list_tasks(limit, user_id)

@app.get("/api/reports/{task_id}")
def get_report(task_id: str):
    task = db_get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    if task["status"] != "success":
        raise HTTPException(status_code=409, detail="报告尚未生成")
    path = REPORT_DIR / f"{task_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="报告文件不存在")
    report = json.loads(path.read_text(encoding="utf-8"))
    # 附加 AI 分析
    ai_row = db.execute("SELECT analysis FROM ai_analyses WHERE task_id = ? ORDER BY id DESC LIMIT 1", (task_id,)).fetchone()
    if ai_row:
        report["ai_analysis"] = json.loads(ai_row["analysis"])
    return report

# ========== AI 分析 API ==========

@app.post("/api/ai/analyze/{task_id}")
def ai_analyze_endpoint(task_id: str):
    task = db_get_task(task_id)
    if not task or task["status"] != "success":
        raise HTTPException(status_code=404, detail="任务不存在或未完成")
    path = REPORT_DIR / f"{task_id}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="报告文件不存在")
    report = json.loads(path.read_text(encoding="utf-8"))
    result = ai_analyze(task_id, report)
    return {"task_id": task_id, "ai_analysis": result}

@app.get("/api/reports/{task_id}/html", response_class=HTMLResponse)
def get_html_report(task_id: str):
    path = REPORT_DIR / f"{task_id}.html"
    if not path.exists():
        raise HTTPException(status_code=404, detail="HTML 报告不存在")
    return HTMLResponse(path.read_text(encoding="utf-8"))

@app.get("/api/reports/{task_id}/download")
def download_html_report(task_id: str):
    path = REPORT_DIR / f"{task_id}.html"
    if not path.exists():
        raise HTTPException(status_code=404, detail="HTML 报告不存在")
    return FileResponse(path, media_type="text/html; charset=utf-8", filename=f"{task_id}_report.html")

@app.get("/api/reports/{task_id}/pdf")
def download_pdf_report(task_id: str):
    """将 HTML 报告转为 PDF 下载"""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib import colors
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        from reportlab.lib.enums import TA_CENTER
    except ImportError:
        raise HTTPException(status_code=500, detail="PDF 生成依赖未安装，请运行: pip install reportlab")

    json_path = REPORT_DIR / f"{task_id}.json"
    if not json_path.exists():
        raise HTTPException(status_code=404, detail="报告不存在")
    data = json.loads(json_path.read_text(encoding="utf-8"))

    pdf_path = REPORT_DIR / f"{task_id}.pdf"
    doc = SimpleDocTemplate(str(pdf_path), pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    # 尝试注册中文字体
    font_name = "Helvetica"
    try:
        import platform
        if platform.system() == "Windows":
            f = r"C:\Windows\Fonts\msyh.ttc"
            if Path(f).exists():
                pdfmetrics.registerFont(TTFont("Chinese", f))
                font_name = "Chinese"
        elif platform.system() == "Darwin":
            f = "/System/Library/Fonts/PingFang.ttc"
            if Path(f).exists():
                pdfmetrics.registerFont(TTFont("Chinese", f))
                font_name = "Chinese"
    except Exception:
        pass

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("Title", parent=styles["Title"], fontName=font_name, fontSize=18, spaceAfter=12)
    h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontName=font_name, fontSize=14, spaceAfter=8)
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontName=font_name, fontSize=12, spaceAfter=6)
    body = ParagraphStyle("Body", parent=styles["BodyText"], fontName=font_name, fontSize=9, leading=14)
    small = ParagraphStyle("Small", parent=styles["BodyText"], fontName=font_name, fontSize=8, leading=12, textColor=colors.grey)
    bold_body = ParagraphStyle("BoldBody", parent=styles["BodyText"], fontName=font_name, fontSize=9, leading=14)

    story = []
    story.append(Paragraph("AppSec Scanner — 安全检测报告", title_style))
    story.append(Spacer(1, 0.3*cm))

    # 基本信息
    s = data.get("summary", {})
    info = [
        ["文件名", data.get("filename", "")],
        ["检测时间", data.get("generated_at", "")],
        ["安全评分", str(data.get("score", ""))],
        ["风险等级", data.get("risk_level", "")],
        ["高危", str(s.get("high", 0))],
        ["中危", str(s.get("medium", 0))],
        ["低危", str(s.get("low", 0))],
        ["信息", str(s.get("info", 0))],
    ]
    tbl = Table(info, colWidths=[4*cm, 12*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("ALIGN", (1, 0), (1, -1), "LEFT"),
        ("FONTNAME", (0, 0), (-1, -1), font_name),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.5*cm))

    # 风险详情
    story.append(Paragraph(f"风险详情 ({len(data.get('findings', []))})", h1))
    for f in data.get("findings", []):
        sev = f.get("severity", "")
        if sev in ("High", "高危"):
            sev_color = colors.HexColor("#EF4444")
        elif sev in ("Medium", "中危"):
            sev_color = colors.HexColor("#F59E0B")
        else:
            sev_color = colors.HexColor("#6366F1")
        story.append(Paragraph(f"<b>{f.get('name', '')}</b> <font color='{sev_color.hexval()}'>{sev}</font>", h2))
        story.append(Paragraph(f"<b>类别：</b>{f.get('category', '')} | <b>位置：</b>{f.get('file', '')}:{f.get('line', '')}", body))
        story.append(Paragraph(f"<b>证据：</b>{f.get('evidence', '')}", body))
        story.append(Paragraph(f"<b>描述：</b>{f.get('description', '')}", body))
        story.append(Paragraph(f"<b>建议：</b>{f.get('suggestion', '')}", body))
        story.append(Spacer(1, 0.2*cm))

    # AI 分析
    ai = data.get("ai_analysis")
    if ai:
        story.append(Paragraph("AI 深度分析", h1))
        story.append(Paragraph(ai.get("risk_assessment", ""), body))
        if ai.get("key_issues"):
            story.append(Paragraph("<b>关键问题</b>", h2))
            for iss in ai["key_issues"]:
                story.append(Paragraph(f"• {iss.get('issue', '')}: {iss.get('impact', '')}", body))
        if ai.get("fix_guide"):
            story.append(Paragraph("<b>修复步骤</b>", h2))
            for step in ai["fix_guide"]:
                story.append(Paragraph(f"{step.get('priority', '')}. {step.get('detail', '')}", body))
        story.append(Spacer(1, 0.3*cm))

    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph("免责声明：本报告由 AppSec Scanner 自动生成，仅供参考，不构成法律建议。", small))

    doc.build(story)
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"{task_id}_report.pdf")


# ========== 任务管理 API ==========

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, authorization: str = Header("")):
    token = authorization.replace("Bearer ", "").strip()
    user_id = auth_verify(token) or ""
    task = db_get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    # 非登录用户只能删除自己的任务，或任何任务（演示模式宽松）
    if user_id and task.get("user_id") and task["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="无权删除此任务")
    # 删除数据库记录和文件
    db.execute("DELETE FROM tasks WHERE task_id = ?", (task_id,))
    db.execute("DELETE FROM ai_analyses WHERE task_id = ?", (task_id,))
    db.commit()
    for f in [REPORT_DIR / f"{task_id}.json", REPORT_DIR / f"{task_id}.html"]:
        if f.exists():
            f.unlink()
    return {"status": "ok", "message": "任务已删除"}

@app.post("/api/reports/{task_id}/regenerate")
def regenerate_report(task_id: str, background_tasks: BackgroundTasks, authorization: str = Header("")):
    token = authorization.replace("Bearer ", "").strip()
    auth_verify(token)  # 仅验证登录状态
    task = db_get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    # 查找原始文件
    save_path = UPLOAD_DIR / f"{task_id}_{task['filename']}"
    if not save_path.exists():
        raise HTTPException(status_code=404, detail="原始文件不存在，无法重新生成报告")
    db_update_task(task_id, status="pending", progress=0, stage="重新生成报告", message="正在重新扫描")
    background_tasks.add_task(run_scan, task_id, save_path, task["filename"])
    return {"status": "ok", "task_id": task_id, "message": "报告重新生成已启动"}

@app.get("/api/rules")
def get_rules():
    """获取所有扫描规则配置"""
    return {
        "rules": SCANNING_RULES,
        "scoring": SCORING,
        "total": len(SCANNING_RULES),
    }

_WEB_INDEX = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>移动应用安全检测</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;color:#1e293b;min-height:100vh}
.header{background:#0f172a;color:#fff;padding:16px 24px;text-align:center}
.header h1{font-size:20px;font-weight:600}
.container{max-width:900px;margin:0 auto;padding:24px 16px}
.card{background:#fff;border-radius:12px;padding:24px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.card h2{font-size:18px;margin-bottom:12px}
.upload-area{border:2px dashed #cbd5e1;border-radius:12px;padding:40px;text-align:center;cursor:pointer;transition:border-color .2s}
.upload-area:hover,.upload-area.dragover{border-color:#3b82f6;background:#eff6ff}
.upload-area p{color:#64748b;margin:8px 0}
.upload-area .icon{font-size:40px}
.btn{display:inline-block;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:opacity .2s}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:#3b82f6;color:#fff}
.btn-primary:hover:not(:disabled){background:#2563eb}
.btn-secondary{background:#e2e8f0;color:#334155}
.btn-secondary:hover:not(:disabled){background:#cbd5e1}
.engine-btn{padding:8px 16px;font-size:13px}
.engine-btn.active{background:#3b82f6;color:#fff;border-color:#3b82f6}
.progress-bar{height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;margin:12px 0}
.progress-bar-fill{height:100%;background:#3b82f6;border-radius:4px;transition:width .3s}
.progress-text{font-size:14px;color:#64748b}
.score-badge{display:inline-block;font-size:36px;font-weight:700;padding:8px 20px;border-radius:12px}
.score-good{background:#dcfce7;color:#16a34a}
.score-warn{background:#fef9c3;color:#ca8a04}
.score-danger{background:#fee2e2;color:#dc2626}
.score-critical{background:#fce7f3;color:#db2777}
.finding-card{border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:8px}
.finding-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.severity-tag{font-size:12px;font-weight:600;padding:2px 8px;border-radius:4px}
.sev-high{background:#fee2e2;color:#dc2626}
.sev-medium{background:#fef9c3;color:#ca8a04}
.sev-low{background:#dbeafe;color:#2563eb}
.sev-info{background:#f1f5f9;color:#64748b}
.finding-meta{font-size:13px;color:#64748b;margin-bottom:4px}
.finding-desc{font-size:14px;margin:6px 0}
.finding-suggestion{font-size:13px;color:#3b82f6;margin-top:4px}
.summary-row{display:flex;gap:16px;flex-wrap:wrap;margin:12px 0}
.summary-item{text-align:center;min-width:60px}
.summary-item .num{font-size:24px;font-weight:700}
.summary-item .label{font-size:12px;color:#64748b}
.tabs{display:flex;gap:8px;margin-bottom:16px}
.tab{flex:1;text-align:center;padding:10px;border-radius:8px;background:#e2e8f0;cursor:pointer;font-size:14px;font-weight:600;transition:background .2s}
.tab.active{background:#3b82f6;color:#fff}
.hidden{display:none!important}
.error-msg{color:#dc2626;font-size:14px;margin-top:8px}
code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;word-break:break-all}
.file-info{font-size:13px;color:#64748b;margin-top:8px}
.history-item{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background .15s}
.history-item:hover{background:#f8fafc}
.history-item .hi-left{flex:1;min-width:0}
.history-item .hi-name{font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.history-item .hi-meta{font-size:12px;color:#64748b;margin-top:2px}
.history-item .hi-score{font-weight:700;font-size:16px;margin-left:16px;white-space:nowrap}
.history-item .hi-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;margin-left:8px}
.hi-running{background:#dbeafe;color:#2563eb}
.hi-done{background:#dcfce7;color:#16a34a}
.hi-fail{background:#fee2e2;color:#dc2626}
@media(max-width:640px){
  .header h1{font-size:16px}
  .container{padding:12px 8px}
  .card{padding:16px}
  .upload-area{padding:24px}
}
</style>
</head>
<body>
<div class="header"><h1>移动应用安全检测 Demo</h1></div>
<div class="container">

  <div class="tabs">
    <div class="tab active" data-tab="upload">上传检测</div>
    <div class="tab" data-tab="progress" style="display:none">检测进度</div>
    <div class="tab" data-tab="report" style="display:none">检测报告</div>
  </div>

  <div id="view-upload" class="card">
    <h2>上传文件</h2>
    <p style="margin-bottom:16px;color:#64748b">选择 APK、ZIP 或源码文件，执行静态安全检测。</p>

    <div style="margin-bottom:16px">
      <label style="font-size:14px;font-weight:600;color:#334155;display:block;margin-bottom:8px">扫描引擎</label>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary engine-btn active" data-engine="rules" onclick="selectEngine('rules', this)">📋 规则引擎</button>
        <button class="btn btn-secondary engine-btn" data-engine="agent" onclick="selectEngine('agent', this)">🤖 AI 多 Agent</button>
      </div>
    </div>

    <div class="upload-area" id="upload-area">
      <div class="icon">&#128194;</div>
      <p>点击选择文件，或拖拽文件到此处</p>
      <p style="font-size:12px">支持 APK / ZIP / 文本文件，最大 50MB</p>
    </div>
    <input type="file" id="file-input" style="display:none" accept=".apk,.zip,.txt,.xml,.json,.kt,.java,.properties,.gradle,.smali,.js,.html"/>
    <div class="file-info" id="selected-file"></div>
    <div style="margin-top:16px">
      <button class="btn btn-primary" id="btn-upload" disabled>开始上传并检测</button>
    </div>
    <div class="error-msg" id="upload-error"></div>
  </div>

  <div id="view-progress" class="card hidden">
    <h2>正在检测</h2>
    <p id="progress-task-id" style="font-size:13px;color:#64748b"></p>
    <p id="progress-stage" style="font-weight:600;margin:8px 0"></p>
    <div class="progress-bar"><div class="progress-bar-fill" id="progress-fill" style="width:0%"></div></div>
    <div class="progress-text" id="progress-text">0%</div>
    <p id="progress-msg" style="font-size:13px;color:#64748b;margin-top:8px"></p>
    <div class="error-msg" id="progress-error"></div>
  </div>

  <div id="view-report" class="card hidden">
    <div id="report-content"></div>
    <div style="margin-top:16px">
      <button class="btn btn-secondary" id="btn-back">返回首页</button>
    </div>
  </div>

  <div class="card" id="history-section">
    <h2>历史任务</h2>
    <div id="history-list"><p style="color:#64748b;font-size:14px">加载中...</p></div>
  </div>

</div>

<script>
const API = '/api';
let currentTaskId = '';
let pollingTimer = null;
let currentEngine = 'rules';

function selectEngine(engine, btn) {
  currentEngine = engine;
  document.querySelectorAll('.engine-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => { x.classList.remove('active'); x.style.display = 'none'; });
    t.classList.add('active');
    showView(t.dataset.tab);
  });
});

function showView(name) {
  ['upload','progress','report'].forEach(v => {
    document.getElementById('view-'+v).classList.toggle('hidden', v !== name);
  });
  document.querySelectorAll('.tab').forEach(t => {
    t.style.display = t.dataset.tab === 'upload' || t.dataset.tab === name ? '' : 'none';
    t.classList.toggle('active', t.dataset.tab === name);
  });
  document.getElementById('history-section').classList.toggle('hidden', name !== 'upload');
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => {
    t.style.display = t.dataset.tab === 'upload' || t.dataset.tab === name ? '' : 'none';
    t.classList.toggle('active', t.dataset.tab === name);
  });
  showView(name);
}

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const btnUpload = document.getElementById('btn-upload');
const selectedFile = document.getElementById('selected-file');
const uploadError = document.getElementById('upload-error');

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  uploadError.textContent = '';
  selectedFile.textContent = '已选择：' + file.name + ' (' + formatSize(file.size) + ')';
  btnUpload.disabled = false;
  btnUpload._file = file;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1024/1024).toFixed(1) + ' MB';
}

btnUpload.addEventListener('click', async () => {
  const file = btnUpload._file;
  if (!file) return;
  btnUpload.disabled = true;
  btnUpload.textContent = '检测中...';
  uploadError.textContent = '';

  try {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await fetch(API + `/upload?engine=${currentEngine}`, { method: 'POST', body: formData });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.detail || '上传失败');
    }
    const data = await resp.json();
    currentTaskId = data.task_id;
    switchTab('progress');
    startPolling();
  } catch(e) {
    uploadError.textContent = e.message;
    btnUpload.disabled = false;
    btnUpload.textContent = '开始上传并检测';
  }
});

function startPolling() {
  document.getElementById('progress-task-id').textContent = '任务编号：' + currentTaskId;
  document.getElementById('progress-error').textContent = '';
  poll();
}

async function poll() {
  try {
    const resp = await fetch(API + '/tasks/' + currentTaskId);
    if (!resp.ok) throw new Error('查询进度失败');
    const data = await resp.json();
    document.getElementById('progress-fill').style.width = data.progress + '%';
    document.getElementById('progress-text').textContent = data.progress + '%';
    document.getElementById('progress-stage').textContent = data.stage || data.status;
    document.getElementById('progress-msg').textContent = data.message || '';

    if (data.status === 'success') {
      switchTab('report');
      loadReport();
      return;
    }
    if (data.status === 'failed') {
      document.getElementById('progress-error').textContent = '检测失败：' + (data.error || data.message);
      return;
    }
    pollingTimer = setTimeout(poll, 1500);
  } catch(e) {
    document.getElementById('progress-error').textContent = e.message;
    pollingTimer = setTimeout(poll, 3000);
  }
}

async function loadReport() {
  const container = document.getElementById('report-content');
  try {
    const resp = await fetch(API + '/reports/' + currentTaskId);
    if (!resp.ok) throw new Error('报告加载失败');
    const report = await resp.json();
    renderReport(report, container);
  } catch(e) {
    container.innerHTML = '<p class="error-msg">' + e.message + '</p>';
  }
}

function renderReport(report, container) {
  const scoreClass = report.score >= 90 ? 'score-good' : report.score >= 70 ? 'score-warn' : report.score >= 40 ? 'score-danger' : 'score-critical';
  const s = report.summary;
  let html = '<div class="card" style="margin-bottom:16px">';
  html += '<h2>检测报告</h2>';
  html += '<p style="font-size:13px;color:#64748b">任务编号：' + esc(report.task_id) + '</p>';
  html += '<p style="font-size:13px;color:#64748b">文件：' + esc(report.filename) + '</p>';
  html += '<p style="font-size:13px;color:#64748b">生成时间：' + esc(report.generated_at) + '</p>';
  html += '<p style="font-size:13px;color:#64748b">SHA256：' + esc((report.app_info||{}).sha256||'') + '</p>';
  html += '</div>';

  html += '<div class="card" style="margin-bottom:16px">';
  html += '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">';
  html += '<span class="score-badge ' + scoreClass + '">' + report.score + ' 分</span>';
  html += '<span style="font-size:18px;font-weight:600">' + esc(report.risk_level) + '</span>';
  html += '</div>';
  html += '<div class="summary-row">';
  html += '<div class="summary-item"><div class="num" style="color:#dc2626">' + (s.high||0) + '</div><div class="label">高危</div></div>';
  html += '<div class="summary-item"><div class="num" style="color:#ca8a04">' + (s.medium||0) + '</div><div class="label">中危</div></div>';
  html += '<div class="summary-item"><div class="num" style="color:#2563eb">' + (s.low||0) + '</div><div class="label">低危</div></div>';
  html += '<div class="summary-item"><div class="num" style="color:#64748b">' + (s.info||0) + '</div><div class="label">信息</div></div>';
  html += '</div></div>';

  if (!report.findings || report.findings.length === 0) {
    html += '<div class="card"><p>未发现明显风险。</p></div>';
  } else {
    html += '<h2 style="margin-bottom:12px">风险详情</h2>';
    const sevMap = {'High':'sev-high','Medium':'sev-medium','Low':'sev-low','Critical':'sev-high','Info':'sev-info'};
    report.findings.forEach(f => {
      html += '<div class="finding-card">';
      html += '<div class="finding-header">';
      html += '<span style="font-weight:600">' + esc(f.name) + '</span>';
      html += '<span class="severity-tag ' + (sevMap[f.severity]||'sev-info') + '">' + esc(f.severity) + '</span>';
      html += '</div>';
      html += '<div class="finding-meta">类别：' + esc(f.category) + ' | 位置：' + esc(f.file) + ':' + f.line + '</div>';
      html += '<div class="finding-meta">证据：<code>' + esc(f.evidence) + '</code></div>';
      html += '<div class="finding-desc">' + esc(f.description) + '</div>';
      html += '<div class="finding-suggestion">建议：' + esc(f.suggestion) + '</div>';
      html += '</div>';
    });
  }
  html += '<p style="margin-top:16px;color:#94a3b8;font-size:12px">' + esc(report.disclaimer||'') + '</p>';
  container.innerHTML = html;
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('btn-back').addEventListener('click', () => {
  if (pollingTimer) { clearTimeout(pollingTimer); pollingTimer = null; }
  currentTaskId = '';
  btnUpload.disabled = true;
  btnUpload.textContent = '开始上传并检测';
  btnUpload._file = null;
  selectedFile.textContent = '';
  uploadError.textContent = '';
  switchTab('upload');
  loadHistory();
});

async function loadHistory() {
  const container = document.getElementById('history-list');
  try {
    const resp = await fetch(API + '/tasks?limit=20');
    if (!resp.ok) throw new Error('加载失败');
    const tasks = await resp.json();
    if (tasks.length === 0) {
      container.innerHTML = '<p style="color:#64748b;font-size:14px">暂无历史任务</p>';
      return;
    }
    let html = '';
    tasks.forEach(t => {
      const statusClass = t.status === 'success' ? 'hi-done' : t.status === 'failed' ? 'hi-fail' : 'hi-running';
      const statusText = t.status === 'success' ? '已完成' : t.status === 'failed' ? '失败' : t.status === 'running' ? '检测中' : '等待中';
      const scoreHtml = t.score != null ? '<span class="hi-score">' + t.score + '分</span>' : '';
      const riskHtml = t.risk_level ? '<span class="hi-badge hi-done">' + esc(t.risk_level) + '</span>' : '';
      html += '<div class="history-item" data-task-id="' + esc(t.task_id) + '" data-status="' + esc(t.status) + '">';
      html += '<div class="hi-left">';
      html += '<div class="hi-name">' + esc(t.filename) + '</div>';
      html += '<div class="hi-meta">' + esc(t.created_at) + ' | ' + esc(t.task_id) + '</div>';
      html += '</div>';
      html += scoreHtml + riskHtml;
      html += '<span class="hi-badge ' + statusClass + '">' + statusText + '</span>';
      html += '</div>';
    });
    container.innerHTML = html;

    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const tid = item.dataset.taskId;
        const st = item.dataset.status;
        if (st === 'success') {
          currentTaskId = tid;
          switchTab('report');
          loadReport();
        } else if (st === 'running' || st === 'pending') {
          currentTaskId = tid;
          switchTab('progress');
          startPolling();
        } else {
          alert('该任务检测失败，无法查看报告');
        }
      });
    });
  } catch(e) {
    container.innerHTML = '<p class="error-msg">加载历史失败：' + e.message + '</p>';
  }
}

loadHistory();
</script>
</body>
</html>"""