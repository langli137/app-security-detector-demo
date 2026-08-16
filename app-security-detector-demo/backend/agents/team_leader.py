"""
TeamLeader 协调器

负责：
1. 接收扫描任务，按阶段分发到各专职 Agent
2. 阶段 1（并行）：ManifestAnalyzer、CodeScanner、WebViewAnalyzer、CryptoAnalyzer
3. 阶段 2（串行）：RiskAssessor → RemediationAdvisor
4. 聚合所有结果，生成最终报告
"""

from __future__ import annotations

import time
from typing import Any, Dict, List

from .base import BaseAgent, AgentResult
from .manifest_analyzer import ManifestAnalyzer
from .code_scanner import CodeScanner
from .webview_analyzer import WebViewAnalyzer
from .crypto_analyzer import CryptoAnalyzer
from .risk_assessor import RiskAssessor
from .remediation_advisor import RemediationAdvisor


class TeamLeader:
    """多 Agent 协调器，负责编排分析流水线"""

    def __init__(self, rules_config: dict, db_conn=None):
        self.rules_config = rules_config
        self.db = db_conn
        self._agents: Dict[str, BaseAgent] = {}
        self._init_agents()

    def _init_agents(self):
        """初始化所有 Agent 实例"""
        agents = [
            ManifestAnalyzer(),
            CodeScanner(),
            WebViewAnalyzer(),
            CryptoAnalyzer(),
            RiskAssessor(),
            RemediationAdvisor(),
        ]
        for agent in agents:
            self._agents[agent.name] = agent

    def register_tools(self, tools: Dict[str, Any]):
        """为所有 Agent 注册工具"""
        for agent in self._agents.values():
            agent.register_tools(tools)

    def run_pipeline(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行完整分析流水线

        Args:
            context: 分析上下文，包含 files (文件列表)、rules (规则配置)、scoring (评分配置)

        Returns:
            dict: 聚合后的分析报告
        """
        start_time = time.time()
        results: Dict[str, AgentResult] = {}

        # 阶段 1：并行分析（4 个 Agent）
        phase1_agents = ["ManifestAnalyzer", "CodeScanner", "WebViewAnalyzer", "CryptoAnalyzer"]
        for agent_name in phase1_agents:
            agent = self._agents.get(agent_name)
            if agent:
                t0 = time.time()
                try:
                    results[agent_name] = agent.analyze(context)
                except Exception as e:
                    results[agent_name] = AgentResult(
                        agent_name=agent_name,
                        errors=[str(e)]
                    )
                results[agent_name].execution_time_ms = (time.time() - t0) * 1000

        # 阶段 2：风险评估（依赖阶段 1 结果）
        risk_context = {
            **context,
            "phase1_results": {
                name: r.to_dict() for name, r in results.items()
            }
        }
        risk_assessor = self._agents.get("RiskAssessor")
        if risk_assessor:
            t0 = time.time()
            try:
                results["RiskAssessor"] = risk_assessor.analyze(risk_context)
            except Exception as e:
                results["RiskAssessor"] = AgentResult(
                    agent_name="RiskAssessor",
                    errors=[str(e)]
                )
            results["RiskAssessor"].execution_time_ms = (time.time() - t0) * 1000

        # 阶段 3：修复建议（依赖风险评估结果）
        fix_context = {
            **risk_context,
            "risk_result": results.get("RiskAssessor", AgentResult(agent_name="RiskAssessor")).to_dict()
        }
        remediation = self._agents.get("RemediationAdvisor")
        if remediation:
            t0 = time.time()
            try:
                results["RemediationAdvisor"] = remediation.analyze(fix_context)
            except Exception as e:
                results["RemediationAdvisor"] = AgentResult(
                    agent_name="RemediationAdvisor",
                    errors=[str(e)]
                )
            results["RemediationAdvisor"].execution_time_ms = (time.time() - t0) * 1000

        total_time = (time.time() - start_time) * 1000

        # 聚合结果
        return self._aggregate(results, context, total_time)

    def _aggregate(self, results: Dict[str, AgentResult], context: Dict[str, Any], total_time_ms: float) -> Dict[str, Any]:
        """聚合所有 Agent 结果，生成最终报告"""
        all_findings = []
        agent_details = {}

        for name, result in results.items():
            all_findings.extend(result.findings)
            agent_details[name] = {
                "agent_name": result.agent_name,
                "agent_version": result.agent_version,
                "finding_count": result.finding_count(),
                "execution_time_ms": result.execution_time_ms,
                "suggestions": result.suggestions,
                "errors": result.errors,
            }

        # 提取风险评估和修复建议
        risk_result = results.get("RiskAssessor")
        fix_result = results.get("RemediationAdvisor")

        report = {
            "engine": "multi-agent",
            "engine_version": "1.0.0",
            "total_time_ms": total_time_ms,
            "total_findings": len(all_findings),
            "findings": all_findings,
            "agent_details": agent_details,
            "risk_assessment": risk_result.summary if risk_result else {},
            "remediation": fix_result.summary if fix_result else {},
            "disclaimer": "本报告由多 Agent 安全分析引擎生成，用于课程、毕设或原型演示。"
        }
        return report