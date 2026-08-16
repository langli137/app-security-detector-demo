"""
风险评估工具

提供风险评分计算和等级评估功能。
"""

from __future__ import annotations

from typing import Dict, List


def calculate_score(
    findings: List[Dict],
    base_score: int = 100,
    severity_deduction: Dict[str, int] = None,
    max_per_rule: int = 5,
) -> Dict[str, any]:
    """
    根据发现列表计算安全评分

    Args:
        findings: 发现列表，每项包含 severity 和 rule_id
        base_score: 基础分（默认 100）
        severity_deduction: 各严重程度扣分值
        max_per_rule: 同一规则最多扣分次数

    Returns:
        {"score": int, "deduction": int, "rule_hits": dict}
    """
    if severity_deduction is None:
        severity_deduction = {
            "Critical": 20, "High": 10, "Medium": 4, "Low": 1, "Info": 0
        }

    rule_count: Dict[str, int] = {}
    deduction = 0

    for f in findings:
        rule_id = f.get("rule_id", "UNKNOWN")
        c = rule_count.get(rule_id, 0)
        if c < max_per_rule:
            deduction += severity_deduction.get(f.get("severity", "Low"), 1)
        rule_count[rule_id] = c + 1

    score = max(0, base_score - deduction)

    return {
        "score": score,
        "deduction": deduction,
        "base_score": base_score,
        "rule_hits": dict(rule_count),
    }


def determine_risk_level(score: int, risk_levels: List[Dict] = None) -> Dict[str, any]:
    """
    根据评分确定风险等级

    Args:
        score: 安全评分
        risk_levels: 风险等级配置列表

    Returns:
        {"label": str, "min": int}
    """
    if risk_levels is None:
        risk_levels = [
            {"min": 90, "label": "良好"},
            {"min": 70, "label": "一般"},
            {"min": 40, "label": "较高风险"},
            {"min": 0, "label": "高风险"},
        ]

    for level in risk_levels:
        if score >= level.get("min", 0):
            return level

    return {"min": 0, "label": "高风险"}


def severity_distribution(findings: List[Dict]) -> Dict[str, int]:
    """
    统计各严重程度的发现数量

    Args:
        findings: 发现列表

    Returns:
        {"Critical": n, "High": n, "Medium": n, "Low": n, "Info": n}
    """
    dist = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Info": 0}
    for f in findings:
        sev = f.get("severity", "Info")
        dist[sev] = dist.get(sev, 0) + 1
    return dist