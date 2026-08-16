"""
多 Agent 分析流水线测试脚本
验证 6 个 Agent 的完整协作流程
"""
import json
from agents.team_leader import TeamLeader
from tools.gateway import ToolGateway
from tools import manifest_tools, code_tools, risk_tools, fix_tools

# 模拟文件上下文（包含典型 Android 安全风险）
files = [
    {
        "name": "AndroidManifest.xml",
        "content": '<manifest><application android:debuggable="true" android:usesCleartextTraffic="true"><uses-permission android:name="android.permission.CAMERA"/><uses-permission android:name="android.permission.READ_SMS"/></application></manifest>'
    },
    {
        "name": "MainActivity.java",
        "content": 'String apiKey = "sk-abc123def456ghijklmn";\nString url = "http://api.example.com/v1";\nwebView.addJavascriptInterface(new Bridge(), "android");\nwebView.setJavaScriptEnabled(true);\nhandler.proceed();\nMessageDigest md = MessageDigest.getInstance("MD5");'
    },
    {
        "name": "NetworkConfig.java",
        "content": 'public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) { handler.proceed(); }\nHostnameVerifier verifier = (hostname, session) -> { return true; };'
    },
    {
        "name": "build.gradle",
        "content": 'implementation "com.android.support:appcompat-v7:28.0.0"'
    },
]

context = {
    "task_id": "test_001",
    "files": files,
    "rules": [],
    "scoring": {
        "base_score": 100,
        "severity_deduction": {"Critical": 20, "High": 10, "Medium": 4, "Low": 1, "Info": 0},
        "risk_levels": [
            {"min": 90, "label": "良好"},
            {"min": 70, "label": "一般"},
            {"min": 40, "label": "较高风险"},
            {"min": 0, "label": "高风险"},
        ],
    },
}

# 构建工具网关
gateway = ToolGateway()
gateway.register("parse_manifest_permissions", manifest_tools.parse_manifest_permissions, "", "manifest")
gateway.register("check_debuggable", manifest_tools.check_debuggable, "", "manifest")
gateway.register("check_cleartext", manifest_tools.check_cleartext, "", "manifest")
gateway.register("check_sensitive_permissions", manifest_tools.check_sensitive_permissions, "", "manifest")
gateway.register("grep_pattern", code_tools.grep_pattern, "", "code")
gateway.register("find_keyword", code_tools.find_keyword, "", "code")
gateway.register("find_keyword_all", code_tools.find_keyword_all, "", "code")
gateway.register("scan_secrets", code_tools.scan_secrets, "", "code")
gateway.register("scan_http_urls", code_tools.scan_http_urls, "", "code")
gateway.register("calculate_score", risk_tools.calculate_score, "", "risk")
gateway.register("determine_risk_level", risk_tools.determine_risk_level, "", "risk")
gateway.register("severity_distribution", risk_tools.severity_distribution, "", "risk")
gateway.register("get_fix_example", fix_tools.get_fix_example, "", "fix")
gateway.register("generate_fix_guide", fix_tools.generate_fix_guide, "", "fix")
gateway.register("generate_compliance_checklist", fix_tools.generate_compliance_checklist, "", "fix")

# 创建 TeamLeader 并运行
leader = TeamLeader(rules_config={}, db_conn=None)
leader.register_tools(gateway.get_tools_dict())

report = leader.run_pipeline(context)

# 输出结果
print("=" * 60)
print("  多 Agent 安全分析报告")
print("=" * 60)

risk = report.get("risk_assessment", {})
print(f"\n综合评分: {risk.get('score', 'N/A')} 分")
print(f"风险等级: {risk.get('risk_level', 'N/A')}")
print(f"总发现数: {report.get('total_findings', 0)}")
print(f"总耗时:   {report.get('total_time_ms', 0):.1f}ms")

print(f"\n--- Agent 执行详情 ---")
for name, detail in report.get("agent_details", {}).items():
    errors = detail.get("errors", [])
    status = " [ERROR]" if errors else " [OK]"
    print(f"  {name}: {detail.get('finding_count', 0)} 项发现, {detail.get('execution_time_ms', 0):.1f}ms{status}")
    if errors:
        for e in errors:
            print(f"    -> {e}")

print(f"\n--- 严重程度分布 ---")
dist = risk.get("severity_distribution", {})
for sev in ["Critical", "High", "Medium", "Low", "Info"]:
    count = dist.get(sev, 0)
    if count > 0:
        print(f"  {sev}: {count} 项")

print(f"\n--- 修复指南 (前 5 步) ---")
for step in report.get("remediation", {}).get("fix_guide", [])[:5]:
    code = step.get("code_example", {})
    code_mark = " [含代码示例]" if code else ""
    print(f"  {step['priority']}. [{step['severity']}] {step['name']}{code_mark}")

print(f"\n--- 上架合规检查 ---")
for item in report.get("remediation", {}).get("compliance_checklist", []):
    print(f"  [{item['status']}] {item['item']}: {item['action']}")

print(f"\n{'=' * 60}")
print("  测试通过 - 多 Agent 流水线运行正常")
print("=" * 60)