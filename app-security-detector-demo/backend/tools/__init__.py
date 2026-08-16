"""
工具模块 - 统一的工具注册和调用机制

提供 ToolGateway 作为工具注册中心，Agent 通过它调用各工具函数。
"""

from .gateway import ToolGateway
from .apk_tools import (
    analyze_apk,
    decode_apk,
    decompile_apk,
    parse_axml_basic,
    scan_smali_directory,
    get_apktool_path,
    get_jadx_path,
)

__all__ = [
    "ToolGateway",
    "analyze_apk",
    "decode_apk",
    "decompile_apk",
    "parse_axml_basic",
    "scan_smali_directory",
    "get_apktool_path",
    "get_jadx_path",
]