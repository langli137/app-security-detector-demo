"""
RemediationAdvisor - 修复建议生成 Agent

负责：
- 基于风险发现生成优先级排序的修复方案
- 提供可操作的具体修复步骤
- 生成代码级别的修复示例
- 输出上架合规性检查清单
"""

from __future__ import annotations

from typing import Any, Dict, List

from .base import BaseAgent, AgentResult


class RemediationAdvisor(BaseAgent):
    """生成修复建议和合规检查清单"""

    def __init__(self):
        super().__init__(name="RemediationAdvisor", version="1.0.0")

    def analyze(self, context: Dict[str, Any]) -> AgentResult:
        result = AgentResult(agent_name=self.name, agent_version=self.version)

        risk_result = context.get("risk_result", {})
        phase1 = context.get("phase1_results", {})

        all_findings = []
        for agent_name, agent_result in phase1.items():
            all_findings.extend(agent_result.get("findings", []))

        # 按严重程度排序
        sev_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3, "Info": 4}
        sorted_findings = sorted(all_findings, key=lambda f: sev_order.get(f.get("severity", "Info"), 99))

        # 生成修复步骤
        fix_guide = []
        seen_rules = set()
        for f in sorted_findings:
            rule_id = f.get("rule_id", "")
            if rule_id not in seen_rules:
                seen_rules.add(rule_id)
                fix_guide.append({
                    "priority": len(fix_guide) + 1,
                    "rule_id": rule_id,
                    "name": f.get("name", ""),
                    "severity": f.get("severity", "Low"),
                    "step": f.get("suggestion", ""),
                    "detail": f.get("description", ""),
                })

        # 上架合规检查清单
        compliance_checklist = [
            {
                "item": "敏感权限声明",
                "requirement": "所有敏感权限需在隐私政策中说明用途",
                "status": "需检查" if any("PERM" in f.get("rule_id", "") for f in all_findings) else "通过",
                "action": "在隐私政策中补充权限用途说明",
            },
            {
                "item": "网络传输安全",
                "requirement": "数据传输应使用 HTTPS",
                "status": "需检查" if any("NET_001" in f.get("rule_id", "") for f in all_findings) else "通过",
                "action": "将所有 HTTP 地址升级为 HTTPS",
            },
            {
                "item": "密钥安全管理",
                "requirement": "禁止硬编码 API Key / Token",
                "status": "需检查" if any("SECRET" in f.get("rule_id", "") for f in all_findings) else "通过",
                "action": "移除硬编码密钥，改用服务端签发临时 Token",
            },
            {
                "item": "WebView 安全",
                "requirement": "WebView 不应暴露不必要的 JS 接口",
                "status": "需检查" if any("WEBVIEW" in f.get("rule_id", "") for f in all_findings) else "通过",
                "action": "限制 addJavascriptInterface 使用，校验 SSL 证书",
            },
            {
                "item": "加密算法合规",
                "requirement": "使用行业标准加密算法（SHA-256、AES-GCM）",
                "status": "需检查" if any("CRYPTO" in f.get("rule_id", "") for f in all_findings) else "通过",
                "action": "将 MD5/SHA1/DES 替换为 SHA-256/AES-GCM",
            },
            {
                "item": "Debug 模式",
                "requirement": "发布版本关闭 debug 模式",
                "status": "需检查" if any("CONFIG" in f.get("rule_id", "") for f in all_findings) else "通过",
                "action": "在 release build 中关闭 android:debuggable",
            },
        ]

        result.summary = {
            "fix_guide": fix_guide,
            "compliance_checklist": compliance_checklist,
            "total_steps": len(fix_guide),
            "compliance_pass_rate": f"{sum(1 for c in compliance_checklist if c['status'] == '通过')}/{len(compliance_checklist)}",
        }
        result.suggestions = [
            "优先修复高危风险项（密钥泄露、SSL 忽略、JS 接口暴露）",
            "修复完成后重新扫描验证",
            "建立 CI/CD 安全扫描流程，防止问题再次引入",
        ]
        return result