"""
修复生成工具

提供修复建议和代码示例的生成功能。
"""

from __future__ import annotations

from typing import Dict, List


# 常见问题的修复代码示例
FIX_EXAMPLES: Dict[str, Dict[str, str]] = {
    "SECRET_001": {
        "title": "硬编码密钥修复",
        "before": 'String apiKey = "sk-abc123def456";\n// 或\napi_key = "sk-abc123def456"',
        "after": '// 方式 1：从服务端动态获取\nString apiKey = fetchTokenFromServer();\n\n// 方式 2：使用 Android Keystore 加密存储\nKeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");\nkeyStore.load(null);\nString apiKey = getEncryptedKey(keyStore, "api_key");',
    },
    "NET_001": {
        "title": "HTTP 升级 HTTPS",
        "before": 'http://api.example.com/v1/',
        "after": 'https://api.example.com/v1/',
    },
    "WEBVIEW_002": {
        "title": "WebView JS 接口安全",
        "before": 'webView.addJavascriptInterface(new JsBridge(), "android");\nwebView.loadUrl("http://any.url");',
        "after": '// 仅向可信页面暴露接口\nif (url.startsWith("https://trusted.example.com")) {\n    webView.addJavascriptInterface(new JsBridge(), "android");\n}\nwebView.loadUrl(url);',
    },
    "TLS_001": {
        "title": "SSL 证书验证修复",
        "before": 'public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {\n    handler.proceed();\n}',
        "after": 'public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {\n    // 生产环境不要忽略证书错误\n    handler.cancel();\n    // 可选：提示用户\n    showSslErrorDialog();\n}',
    },
    "CRYPTO_001": {
        "title": "弱密码算法升级",
        "before": 'MessageDigest md = MessageDigest.getInstance("MD5");\nbyte[] hash = md.digest(data);',
        "after": 'MessageDigest md = MessageDigest.getInstance("SHA-256");\nbyte[] hash = md.digest(data);',
    },
    "CONFIG_001": {
        "title": "关闭 Debug 模式",
        "before": '<application android:debuggable="true" ...>',
        "after": '<application android:debuggable="false" ...>',
    },
}


def get_fix_example(rule_id: str) -> Dict[str, str]:
    """
    获取指定规则的修复代码示例

    Args:
        rule_id: 规则 ID

    Returns:
        {"title": str, "before": str, "after": str} 或空字典
    """
    return FIX_EXAMPLES.get(rule_id, {})


def generate_fix_guide(findings: List[Dict]) -> List[Dict]:
    """
    根据发现列表生成优先级排序的修复指南

    Args:
        findings: 发现列表

    Returns:
        [{"priority": int, "rule_id": str, "name": str, "severity": str, "step": str, "code_example": dict}, ...]
    """
    sev_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3, "Info": 4}
    sorted_findings = sorted(findings, key=lambda f: sev_order.get(f.get("severity", "Info"), 99))

    seen_rules = set()
    guide = []

    for f in sorted_findings:
        rule_id = f.get("rule_id", "")
        if rule_id not in seen_rules:
            seen_rules.add(rule_id)
            guide.append({
                "priority": len(guide) + 1,
                "rule_id": rule_id,
                "name": f.get("name", ""),
                "severity": f.get("severity", "Low"),
                "step": f.get("suggestion", ""),
                "code_example": get_fix_example(rule_id),
            })

    return guide


def generate_compliance_checklist(findings: List[Dict]) -> List[Dict]:
    """
    生成上架合规检查清单

    Args:
        findings: 发现列表

    Returns:
        [{"item": str, "requirement": str, "status": str, "action": str}, ...]
    """
    finding_ids = {f.get("rule_id", "") for f in findings}

    checklist = [
        {
            "item": "敏感权限声明",
            "requirement": "所有敏感权限需在隐私政策中说明用途",
            "status": "需检查" if any("PERM" in rid for rid in finding_ids) else "通过",
            "action": "在隐私政策中补充权限用途说明",
        },
        {
            "item": "网络传输安全",
            "requirement": "数据传输应使用 HTTPS",
            "status": "需检查" if any("NET_001" in rid for rid in finding_ids) else "通过",
            "action": "将所有 HTTP 地址升级为 HTTPS",
        },
        {
            "item": "密钥安全管理",
            "requirement": "禁止硬编码 API Key / Token",
            "status": "需检查" if any("SECRET" in rid for rid in finding_ids) else "通过",
            "action": "移除硬编码密钥，改用服务端签发临时 Token",
        },
        {
            "item": "WebView 安全",
            "requirement": "WebView 不应暴露不必要的 JS 接口",
            "status": "需检查" if any("WEBVIEW" in rid for rid in finding_ids) else "通过",
            "action": "限制 addJavascriptInterface 使用，校验 SSL 证书",
        },
        {
            "item": "加密算法合规",
            "requirement": "使用行业标准加密算法（SHA-256/AES-GCM）",
            "status": "需检查" if any("CRYPTO" in rid for rid in finding_ids) else "通过",
            "action": "将 MD5/SHA1/DES 替换为 SHA-256/AES-GCM",
        },
        {
            "item": "Debug 模式",
            "requirement": "发布版本关闭 debug 模式",
            "status": "需检查" if any("CONFIG" in rid for rid in finding_ids) else "通过",
            "action": "在 release build 中关闭 android:debuggable",
        },
    ]
    return checklist