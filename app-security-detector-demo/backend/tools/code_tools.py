"""
代码扫描工具

提供源码文本的扫描和分析功能。
"""

from __future__ import annotations

import re
from typing import Dict, List, Optional, Tuple


def grep_pattern(text: str, pattern: str, flags: int = 0) -> List[Tuple[int, str]]:
    """
    在文本中搜索正则模式，返回 (行号, 匹配内容) 列表

    Args:
        text: 文本内容
        pattern: 正则表达式
        flags: re 标志位

    Returns:
        [(line_number, matched_text), ...]
    """
    results = []
    for match in re.finditer(pattern, text, flags):
        line_no = text[:match.start()].count("\n") + 1
        results.append((line_no, match.group(0).strip()[:100]))
    return results


def find_keyword(text: str, keyword: str) -> List[int]:
    """
    在文本中搜索关键字，返回所有匹配的行号列表

    Args:
        text: 文本内容
        keyword: 要搜索的关键字

    Returns:
        [line_number, ...]
    """
    lines = text.split("\n")
    result = []
    for i, line in enumerate(lines):
        if keyword in line:
            # 跳过注释行
            stripped = line.strip()
            if stripped.startswith("//") or stripped.startswith("#") or stripped.startswith("*"):
                continue
            result.append(i + 1)
    return result


def find_keyword_all(text: str, keywords: List[str]) -> bool:
    """
    检查文本中是否同时包含所有关键字

    Args:
        text: 文本内容
        keywords: 关键字列表

    Returns:
        True 如果所有关键字都存在
    """
    return all(kw in text for kw in keywords)


def scan_secrets(text: str) -> List[Dict[str, any]]:
    """
    扫描文本中的硬编码密钥

    Args:
        text: 文本内容

    Returns:
        [{"line": int, "evidence": str}, ...]
    """
    pattern = re.compile(
        r'(?i)(api[_-]?key|secret|token|access[_-]?key|password)\s*[:=]\s*["\']?[A-Za-z0-9_\-]{8,}'
    )
    results = []
    for match in pattern.finditer(text):
        line_no = text[:match.start()].count("\n") + 1
        results.append({
            "line": line_no,
            "evidence": match.group(0).strip()[:100],
        })
    return results


def scan_http_urls(text: str) -> List[Dict[str, any]]:
    """
    扫描文本中的明文 HTTP 地址

    Args:
        text: 文本内容

    Returns:
        [{"line": int, "evidence": str}, ...]
    """
    pattern = re.compile(r'http://[^\s"\'<>]+')
    skip_patterns = ["xmlns", "schema", "w3.org"]
    results = []
    for match in pattern.finditer(text):
        evidence = match.group(0).strip()
        if any(skip in evidence.lower() for skip in skip_patterns):
            continue
        line_no = text[:match.start()].count("\n") + 1
        results.append({
            "line": line_no,
            "evidence": evidence[:100],
        })
    return results