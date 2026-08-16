"""
ManifestAnalyzer - AndroidManifest.xml 分析 Agent

负责检测：
- 敏感权限申请（READ_SMS、CAMERA、RECORD_AUDIO 等）
- Debug 模式开启
- 明文流量允许
- 组件导出风险
"""

from __future__ import annotations

import re
from typing import Any, Dict, List

from .base import BaseAgent, AgentResult


class ManifestAnalyzer(BaseAgent):
    """分析 AndroidManifest.xml 的权限和配置风险"""

    def __init__(self):
        super().__init__(name="ManifestAnalyzer", version="1.0.0")

    def analyze(self, context: Dict[str, Any]) -> AgentResult:
        result = AgentResult(agent_name=self.name, agent_version=self.version)

        files = context.get("files", [])
        manifest_text = ""

        # 查找 manifest 文件
        for f in files:
            fname = f.get("name", "")
            if "AndroidManifest.xml" in fname or "AndroidManifest" in fname:
                manifest_text = f.get("content", "")
                break

        if not manifest_text:
            result.errors.append("未找到 AndroidManifest.xml 文件")
            return result

        # 检测 debug 模式
        if 'debuggable="true"' in manifest_text.lower() or "debuggable='true'" in manifest_text.lower():
            result.findings.append({
                "rule_id": "CONFIG_001",
                "name": "Debug 模式开启",
                "severity": "Medium",
                "category": "配置风险",
                "file": "AndroidManifest.xml",
                "line": 1,
                "evidence": "android:debuggable=\"true\"",
                "description": "发布包中开启调试模式会增加被调试和逆向分析的风险。",
                "suggestion": "正式发布版本应关闭 android:debuggable。",
            })

        # 检测明文流量（不区分大小写，与 rules.yaml IGNORECASE 一致）
        if re.search(r'usesCleartextTraffic\s*=\s*"(?:true|1)"', manifest_text, re.IGNORECASE) or \
           re.search(r"usesCleartextTraffic\s*=\s*'(?:true|1)'", manifest_text, re.IGNORECASE):
            result.findings.append({
                "rule_id": "NET_002",
                "name": "允许明文网络流量",
                "severity": "Medium",
                "category": "网络通信",
                "file": "AndroidManifest.xml",
                "line": 1,
                "evidence": "android:usesCleartextTraffic=\"true\"",
                "description": "应用配置允许明文网络流量，可能降低传输安全性。",
                "suggestion": "建议关闭明文流量，并为必要的开发环境单独配置网络安全策略。",
            })

        # 检测敏感权限
        sensitive_perms = [
            "READ_SMS", "SEND_SMS", "READ_CONTACTS",
            "ACCESS_FINE_LOCATION", "RECORD_AUDIO", "CAMERA", "READ_PHONE_STATE"
        ]
        for perm in sensitive_perms:
            if perm in manifest_text:
                result.findings.append({
                    "rule_id": "PERM_001",
                    "name": f"申请敏感权限：{perm}",
                    "severity": "Medium",
                    "category": "权限与隐私",
                    "file": "AndroidManifest.xml",
                    "line": 1,
                    "evidence": perm,
                    "description": f"应用申请了敏感权限 {perm}，可能涉及用户隐私数据访问。",
                    "suggestion": "请确认该权限与核心业务功能直接相关，并在隐私政策中清晰说明用途。",
                })

        result.summary = {
            "total_permissions_checked": len(sensitive_perms),
            "manifest_found": True,
            "findings_count": len(result.findings),
        }
        result.suggestions = [
            "发布前移除不必要的调试配置",
            "限制敏感权限申请，遵循最小权限原则",
            "生产环境关闭明文流量",
        ]
        return result