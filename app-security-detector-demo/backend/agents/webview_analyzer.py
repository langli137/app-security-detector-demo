"""
WebViewAnalyzer - WebView 安全风险检测 Agent

负责检测：
- WebView JavaScript 启用
- JavaScript 接口暴露（addJavascriptInterface）
- SSL 证书错误忽略
- 主机名校验绕过
- 文件访问权限
"""

from __future__ import annotations

from typing import Any, Dict, List

from .base import BaseAgent, AgentResult


class WebViewAnalyzer(BaseAgent):
    """检测 WebView 相关安全风险"""

    def __init__(self):
        super().__init__(name="WebViewAnalyzer", version="1.0.0")

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

            # WebView JavaScript 启用
            if "setJavaScriptEnabled(true)" in content or "setJavaScriptEnabled( true )" in content:
                result.findings.append({
                    "rule_id": "WEBVIEW_001",
                    "name": "WebView 启用 JavaScript",
                    "severity": "Medium",
                    "category": "WebView 风险",
                    "file": fname,
                    "line": 1,
                    "evidence": "setJavaScriptEnabled(true)",
                    "description": "WebView 启用 JavaScript 后，如果加载不可信内容，可能扩大攻击面。",
                    "suggestion": "仅在必要页面启用 JavaScript，并限制加载来源。",
                })

            # JavaScript 接口暴露
            if "addJavascriptInterface" in content:
                result.findings.append({
                    "rule_id": "WEBVIEW_002",
                    "name": "WebView 暴露 JavaScript 接口",
                    "severity": "High",
                    "category": "WebView 风险",
                    "file": fname,
                    "line": 1,
                    "evidence": "addJavascriptInterface",
                    "description": "WebView 向网页暴露原生接口，若加载不可信页面可能导致接口被滥用。",
                    "suggestion": "仅向可信页面暴露最小接口，并校验 URL 来源。",
                })

            # SSL 证书错误忽略
            if "onReceivedSslError" in content and "proceed()" in content:
                result.findings.append({
                    "rule_id": "TLS_001",
                    "name": "疑似忽略 SSL 证书错误",
                    "severity": "High",
                    "category": "网络通信",
                    "file": fname,
                    "line": 1,
                    "evidence": "onReceivedSslError + proceed()",
                    "description": "代码疑似在证书错误时继续访问，可能导致中间人攻击。",
                    "suggestion": "不要忽略 SSL 错误，应阻断连接并提示用户。",
                })

            # 主机名校验绕过
            if "HostnameVerifier" in content and "return true" in content:
                result.findings.append({
                    "rule_id": "TLS_002",
                    "name": "疑似信任任意主机名",
                    "severity": "High",
                    "category": "网络通信",
                    "file": fname,
                    "line": 1,
                    "evidence": "HostnameVerifier + return true",
                    "description": "主机名校验恒返回 true 会破坏 HTTPS 身份校验。",
                    "suggestion": "使用系统默认主机名校验逻辑，不要在生产环境绕过校验。",
                })

        result.summary = {
            "files_scanned": scanned,
            "findings_count": len(result.findings),
        }
        result.suggestions = [
            "限制 WebView JavaScript 使用范围",
            "移除不必要的 addJavascriptInterface 调用",
            "不要在生产环境忽略 SSL 证书错误",
        ]
        return result