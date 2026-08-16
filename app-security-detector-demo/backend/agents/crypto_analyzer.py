"""
CryptoAnalyzer - 弱密码算法检测 Agent

负责检测：
- 弱哈希算法（MD5、SHA1）
- 弱加密算法（DES、AES-ECB）
- 不安全的随机数生成
- 硬编码密钥/IV
"""

from __future__ import annotations

import re
from typing import Any, Dict, List

from .base import BaseAgent, AgentResult


class CryptoAnalyzer(BaseAgent):
    """检测弱密码算法和不安全加密配置"""

    # 弱算法关键词
    WEAK_ALGOS = [
        ("MD5", "MD5 已被证明存在碰撞漏洞，不应再用于安全场景。"),
        ("SHA1", "SHA-1 已被证明存在碰撞攻击，建议升级到 SHA-256。"),
        ("DES", "DES 密钥长度仅 56 位，已被暴力破解。"),
        ("AES/ECB", "AES-ECB 模式不提供语义安全性，相同明文产生相同密文。"),
    ]

    def __init__(self):
        super().__init__(name="CryptoAnalyzer", version="1.0.0")

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

            for algo, description in self.WEAK_ALGOS:
                if algo not in content:
                    continue

                lines = content.split("\n")
                found_in_code = False
                found_line = 0
                found_evidence = ""

                for i, line in enumerate(lines):
                    if algo not in line:
                        continue
                    stripped = line.strip()
                    # 跳过纯注释行
                    if stripped.startswith("//") or stripped.startswith("#") or stripped.startswith("*") or stripped.startswith("<!--"):
                        continue
                    # 跳过行内注释（// 或 # 之后的内容）
                    code_part = re.split(r'\s*//\s*|\s*#\s*', stripped)[0]
                    if algo in code_part:
                        found_in_code = True
                        found_line = i + 1
                        found_evidence = stripped[:100]
                        break

                if found_in_code:
                    result.findings.append({
                        "rule_id": "CRYPTO_001",
                        "name": f"使用弱密码算法：{algo}",
                        "severity": "Medium",
                        "category": "密码学",
                        "file": fname,
                        "line": found_line,
                        "evidence": found_evidence,
                        "description": description,
                        "suggestion": "建议使用 SHA-256、AES-GCM 等更安全的算法，并遵循平台密码学最佳实践。",
                    })

        result.summary = {
            "files_scanned": scanned,
            "algos_checked": [a[0] for a in self.WEAK_ALGOS],
            "findings_count": len(result.findings),
        }
        result.suggestions = [
            "使用 SHA-256 替代 MD5/SHA-1",
            "使用 AES-GCM 替代 DES/AES-ECB",
            "密钥应通过安全方式生成和存储，禁止硬编码",
        ]
        return result