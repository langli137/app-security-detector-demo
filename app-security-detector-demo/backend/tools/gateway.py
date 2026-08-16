"""
工具模块 - 工具注册与调用网关

提供统一的工具注册、查找和调用机制。
Agent 通过 Tool Gateway 调用工具，而非直接访问文件系统或外部服务。
便于后续替换为真实 MCP Server。
"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional


class ToolGateway:
    """
    工具网关 - 统一的工具注册表和调用入口

    用法:
        gateway = ToolGateway()
        gateway.register("manifest_parser", parse_manifest)
        result = gateway.call("manifest_parser", file_path)
    """

    def __init__(self):
        self._tools: Dict[str, Callable] = {}
        self._metadata: Dict[str, Dict[str, Any]] = {}

    def register(self, name: str, func: Callable, description: str = "", category: str = "") -> None:
        """
        注册一个工具函数

        Args:
            name: 工具名称（唯一标识）
            func: 工具函数
            description: 工具描述
            category: 工具分类（如 manifest、code、risk、fix）
        """
        if name in self._tools:
            raise ValueError(f"工具 '{name}' 已注册")
        self._tools[name] = func
        self._metadata[name] = {
            "description": description,
            "category": category,
        }

    def call(self, name: str, *args, **kwargs) -> Any:
        """
        调用已注册的工具

        Args:
            name: 工具名称
            *args: 位置参数
            **kwargs: 关键字参数

        Returns:
            工具函数的返回值

        Raises:
            KeyError: 工具未注册
        """
        if name not in self._tools:
            raise KeyError(
                f"工具 '{name}' 未注册。可用工具: {list(self._tools.keys())}"
            )
        return self._tools[name](*args, **kwargs)

    def list_tools(self, category: str = "") -> List[Dict[str, Any]]:
        """
        列出所有已注册的工具

        Args:
            category: 按分类过滤（为空则返回全部）

        Returns:
            工具列表，每项包含 name、description、category
        """
        result = []
        for name, meta in self._metadata.items():
            if not category or meta["category"] == category:
                result.append({"name": name, **meta})
        return result

    def get_tools_dict(self) -> Dict[str, Callable]:
        """获取所有工具函数的字典，供 Agent 注册使用"""
        return dict(self._tools)

    def __len__(self) -> int:
        return len(self._tools)

    def __repr__(self) -> str:
        return f"<ToolGateway: {len(self._tools)} tools registered>"