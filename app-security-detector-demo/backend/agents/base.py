"""
Agent 基类模块

定义所有分析 Agent 的抽象接口和通用数据结构。
每个 Agent 负责一个独立的分析维度，通过 Tool Gateway 调用工具。
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional


@dataclass
class AgentResult:
    """单个 Agent 的分析结果"""
    agent_name: str                          # Agent 名称
    agent_version: str = "1.0.0"             # Agent 版本
    findings: List[Dict[str, Any]] = field(default_factory=list)  # 发现列表
    summary: Dict[str, Any] = field(default_factory=dict)         # 汇总信息
    suggestions: List[str] = field(default_factory=list)           # 建议列表
    errors: List[str] = field(default_factory=list)                # 错误信息
    execution_time_ms: float = 0.0           # 执行耗时（毫秒）

    def to_dict(self) -> dict:
        return asdict(self)

    def finding_count(self) -> int:
        return len(self.findings)

    def has_errors(self) -> bool:
        return len(self.errors) > 0


class BaseAgent(ABC):
    """
    分析 Agent 抽象基类

    所有 Agent 必须实现 analyze() 方法。
    子类通过 self.tools 调用 Tool Gateway 中注册的工具函数。
    """

    def __init__(self, name: str, version: str = "1.0.0"):
        self.name = name
        self.version = version
        self._tools: Dict[str, Any] = {}

    def register_tools(self, tools: Dict[str, Any]):
        """注册工具函数到 Agent"""
        self._tools.update(tools)

    def call_tool(self, tool_name: str, *args, **kwargs) -> Any:
        """调用已注册的工具函数"""
        tool = self._tools.get(tool_name)
        if tool is None:
            raise RuntimeError(
                f"[{self.name}] 工具 '{tool_name}' 未注册。"
                f"可用工具: {list(self._tools.keys())}"
            )
        return tool(*args, **kwargs)

    @abstractmethod
    def analyze(self, context: Dict[str, Any]) -> AgentResult:
        """
        执行分析

        Args:
            context: 分析上下文，包含文件内容、配置等。

        Returns:
            AgentResult: 分析结果。
        """
        ...

    def __repr__(self) -> str:
        return f"<{self.name} v{self.version}>"