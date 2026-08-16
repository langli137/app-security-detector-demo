"""
Manifest 解析工具

提供 AndroidManifest.xml 的解析和检查功能。
"""

from __future__ import annotations

import re
from typing import Dict, List, Optional


def parse_manifest_permissions(manifest_text: str) -> List[str]:
    """从 manifest 文本中提取所有权限声明"""
    perms = re.findall(r'android\.permission\.\w+', manifest_text)
    return list(set(perms))


def parse_manifest_components(manifest_text: str) -> List[Dict[str, str]]:
    """从 manifest 文本中提取四大组件信息"""
    components = []
    for tag in ["activity", "service", "receiver", "provider"]:
        for match in re.finditer(rf'<{tag}[^>]*>', manifest_text, re.IGNORECASE):
            name = re.search(r'android:name\s*=\s*"([^"]+)"', match.group(0))
            exported = "exported" in match.group(0).lower()
            components.append({
                "type": tag,
                "name": name.group(1) if name else "unknown",
                "exported": exported,
            })
    return components


def check_debuggable(manifest_text: str) -> bool:
    """检查是否开启 debug 模式"""
    return bool(re.search(r'debuggable\s*=\s*"(?:true|1)"', manifest_text, re.IGNORECASE))


def check_cleartext(manifest_text: str) -> bool:
    """检查是否允许明文流量"""
    return bool(re.search(r'usesCleartextTraffic\s*=\s*"(?:true|1)"', manifest_text, re.IGNORECASE))


def check_sensitive_permissions(manifest_text: str) -> List[str]:
    """检查是否申请了敏感权限"""
    sensitive = [
        "READ_SMS", "SEND_SMS", "READ_CONTACTS",
        "ACCESS_FINE_LOCATION", "RECORD_AUDIO", "CAMERA", "READ_PHONE_STATE"
    ]
    found = []
    for perm in sensitive:
        if perm in manifest_text:
            found.append(perm)
    return found