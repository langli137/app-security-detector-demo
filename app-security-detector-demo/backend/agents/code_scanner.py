"""
CodeScanner - 代码硬编码密钥扫描 Agent

负责检测：
- 硬编码 API Key / Token / Secret
- 明文 HTTP 地址
- 密码明文存储
"""

from __future__ import annotations

import re
from typing import Any, Dict, List

from .base import BaseAgent, AgentResult


class CodeScanner(BaseAgent):
    """扫描源码中的硬编码密钥和敏感信息"""

    # 密钥检测正则
    SECRET_PATTERNS = [
        (re.compile(r'(?i)(api[_-]?key|secret|token|access[_-]?key|password)\s*[:=]\s*["\']?[A-Za-z0-9_\-]{8,}'), "SECRET_001"),
        (re.compile(r'http://[^\s"\'<>]+'), "NET_001"),
    ]

    def __init__(self):
        super().__init__(name="CodeScanner", version="1.0.0")

    def analyze(self, context: Dict[str, Any]) -> AgentResult:
        result = AgentResult(agent_name=self.name, agent_version=self.version)

        files = context.get("files", [])
        scanned = 0

        for f in files:
            fname = f.get("name", "")
            content = f.get("content", "")
            if not content:
                continue

            scanned += 1
            lines = content.split("\n")

            for pattern, rule_id in self.SECRET_PATTERNS:
                for match in pattern.finditer(content):
                    evidence = match.group(0).strip()
                    line_no = content[:match.start()].count("\n") + 1

                    if rule_id == "SECRET_001":
                        result.findings.append({
                            "rule_id": rule_id,
                            "name": "疑似硬编码密钥或 Token",
                            "severity": "High",
                            "category": "密钥泄露",
                            "file": fname,
                            "line": line_no,
                            "evidence": evidence[:100],
                            "description": "代码或配置中发现疑似硬编码密钥，攻击者可能通过反编译获取。",
                            "suggestion": "建议移除客户端硬编码密钥，改为服务端签发临时 Token。",
                        })
                    elif rule_id == "NET_001":
                        # 过滤掉常见误报（如 xmlns、schema 声明）
                        if any(skip in evidence.lower() for skip in ["xmlns", "schema", "w3.org"]):
                            continue
                        result.findings.append({
                            "rule_id": rule_id,
                            "name": "发现明文 HTTP 地址",
                            "severity": "Medium",
                            "category": "网络通信",
                            "file": fname,
                            "line": line_no,
                            "evidence": evidence[:100],
                            "description": "代码中包含明文 HTTP 地址，可能导致传输内容被窃听。",
                            "suggestion": "建议改用 HTTPS，并在服务端配置有效 TLS 证书。",
                        })

        result.summary = {
            "files_scanned": scanned,
            "patterns_used": len(self.SECRET_PATTERNS),
            "findings_count": len(result.findings),
        }
        result.suggestions = [
            "所有 API Key 应从服务端动态获取",
            "使用 HTTPS 替代 HTTP",
            "敏感配置项应加密存储或使用环境变量",
        ]
        return result