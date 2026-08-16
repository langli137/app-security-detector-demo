"""
RiskAssessor - 风险评分与等级评估 Agent

负责：
- 聚合所有 Agent 的发现
- 按严重程度计算扣分
- 输出评分和风险等级
- 生成风险分布统计
"""

from __future__ import annotations

from typing import Any, Dict, List

from .base import BaseAgent, AgentResult


class RiskAssessor(BaseAgent):
    """评估整体风险等级并计算评分"""

    def __init__(self):
        super().__init__(name="RiskAssessor", version="1.0.0")

    def analyze(self, context: Dict[str, Any]) -> AgentResult:
        result = AgentResult(agent_name=self.name, agent_version=self.version)

        scoring = context.get("scoring", {})
        base_score = scoring.get("base_score", 100)
        severity_deduction = scoring.get("severity_deduction", {
            "Critical": 20, "High": 10, "Medium": 4, "Low": 1, "Info": 0
        })
        risk_levels = scoring.get("risk_levels", [
            {"min": 90, "label": "良好"},
            {"min": 70, "label": "一般"},
            {"min": 40, "label": "较高风险"},
            {"min": 0, "label": "高风险"},
        ])

        # 从阶段 1 结果中收集所有发现
        phase1 = context.get("phase1_results", {})
        all_findings = []
        for agent_name, agent_result in phase1.items():
            all_findings.extend(agent_result.get("findings", []))

        # 计算扣分
        rule_count: Dict[str, int] = {}
        deduction = 0
        for f in all_findings:
            max_ded = 5
            rule_id = f.get("rule_id", "UNKNOWN")
            c = rule_count.get(rule_id, 0)
            if c < max_ded:
                deduction += severity_deduction.get(f.get("severity", "Low"), 1)
            rule_count[rule_id] = c + 1

        score = max(0, base_score - deduction)

        # 确定风险等级
        risk_level = "高风险"
        for level in risk_levels:
            if score >= level.get("min", 0):
                risk_level = level.get("label", "未知")
                break

        # 统计分布
        severity_dist = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Info": 0}
        for f in all_findings:
            sev = f.get("severity", "Info")
            severity_dist[sev] = severity_dist.get(sev, 0) + 1

        result.summary = {
            "score": score,
            "risk_level": risk_level,
            "base_score": base_score,
            "total_deduction": deduction,
            "severity_distribution": severity_dist,
            "total_findings": len(all_findings),
            "unique_rules_hit": len(rule_count),
        }
        result.suggestions = self._generate_overall_suggestions(severity_dist, score)

        return result

    def _generate_overall_suggestions(self, severity_dist: dict, score: int) -> List[str]:
        suggestions = []
        if severity_dist.get("High", 0) > 0:
            suggestions.append(f"存在 {severity_dist['High']} 项高危风险，建议立即修复后重新扫描")
        if severity_dist.get("Medium", 0) > 0:
            suggestions.append(f"存在 {severity_dist['Medium']} 项中危风险，建议在下次迭代中修复")
        if score >= 90:
            suggestions.append("整体安全状况良好，继续保持")
        elif score < 40:
            suggestions.append("安全评分较低，建议进行全面安全审计")
        return suggestions