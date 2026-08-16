"""
多 Agent 安全分析模块

基于 OpsPilot AgentTeams 架构的轻量版实现，包含 6 个专职 Agent：
- TeamLeader: 任务协调与结果聚合
- ManifestAnalyzer: AndroidManifest.xml 分析
- CodeScanner: 代码硬编码密钥扫描
- WebViewAnalyzer: WebView 安全风险检测
- CryptoAnalyzer: 弱密码算法检测
- RiskAssessor: 风险评分与等级评估
- RemediationAdvisor: 修复建议生成
"""

from .base import BaseAgent, AgentResult
from .team_leader import TeamLeader

__all__ = [
    "BaseAgent",
    "AgentResult",
    "TeamLeader",
]