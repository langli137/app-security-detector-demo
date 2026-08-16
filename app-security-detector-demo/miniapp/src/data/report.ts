import type { ReportData, AiAnalysis } from '@/types';

const mockReport: ReportData = {
  task_id: 'task_mock_demo1',
  filename: 'demo_vulnerable_source.zip',
  generated_at: '2026-08-04T22:00:05',
  score: 52,
  risk_level: '较高风险',
  summary: {
    critical: 0,
    high: 2,
    medium: 7,
    low: 0,
    info: 0
  },
  app_info: {
    filename: 'demo_vulnerable_source.zip',
    size_bytes: 1024,
    md5: 'abc123def456',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    scanned_files: 2
  },
  findings: [
    {
      rule_id: 'SECRET_001',
      name: '疑似硬编码密钥或 Token',
      severity: 'High',
      category: '密钥泄露',
      file: 'app/src/main/java/com/demo/MainActivity.kt',
      line: 4,
      evidence: 'api_key = "API_KEY_1234567890"',
      description: '代码或配置中发现疑似硬编码密钥，攻击者可能通过反编译或源码泄露获取。',
      suggestion: '建议移除客户端硬编码密钥，改为服务端签发临时 Token。'
    },
    {
      rule_id: 'WEBVIEW_002',
      name: 'WebView 暴露 JavaScript 接口',
      severity: 'High',
      category: 'WebView 风险',
      file: 'app/src/main/java/com/demo/MainActivity.kt',
      line: 1,
      evidence: 'addJavascriptInterface',
      description: 'WebView 向网页暴露原生接口，若加载不可信页面可能导致接口被滥用。',
      suggestion: '仅向可信页面暴露最小接口，并校验 URL 来源。'
    },
    {
      rule_id: 'NET_001',
      name: '发现明文 HTTP 地址',
      severity: 'Medium',
      category: '网络通信',
      file: 'app/src/main/java/com/demo/MainActivity.kt',
      line: 5,
      evidence: 'http://example.com/api/login',
      description: '代码或资源中包含明文 HTTP 地址，可能导致传输内容被窃听或篡改。',
      suggestion: '建议改用 HTTPS，并在服务端配置有效 TLS 证书。'
    },
    {
      rule_id: 'PERM_001',
      name: '申请敏感权限',
      severity: 'Medium',
      category: '权限与隐私',
      file: 'app/src/main/AndroidManifest.xml',
      line: 2,
      evidence: 'READ_SMS',
      description: '应用申请了敏感权限，可能涉及用户隐私数据访问。',
      suggestion: '请确认该权限与核心业务功能直接相关。'
    },
    {
      rule_id: 'NET_002',
      name: '允许明文网络流量',
      severity: 'Medium',
      category: '网络通信',
      file: 'app/src/main/AndroidManifest.xml',
      line: 1,
      evidence: 'usesCleartextTraffic=true',
      description: '应用配置允许明文网络流量，可能降低传输安全性。',
      suggestion: '建议关闭明文流量。'
    },
    {
      rule_id: 'CONFIG_001',
      name: 'Debug 模式开启',
      severity: 'Medium',
      category: '配置风险',
      file: 'app/src/main/AndroidManifest.xml',
      line: 1,
      evidence: 'debuggable=true',
      description: '发布包中开启调试模式会增加被调试和逆向分析的风险。',
      suggestion: '正式发布版本应关闭 android:debuggable。'
    }
  ],
  disclaimer: '本报告由演示级静态规则生成，仅用于课程、毕设或原型演示，不能替代专业安全产品和人工审计。',
  ai_analysis: {
    risk_assessment: '经静态规则扫描，共发现 6 项风险（高危 2 项）。建议优先修复密钥泄露和 WebView 接口暴露问题，修复后重新扫描验证。',
    key_issues: [
      { issue: '疑似硬编码密钥或 Token', impact: '攻击者可能通过反编译或源码泄露获取 API Key，直接调用后端服务造成数据泄露。' },
      { issue: 'WebView 暴露 JavaScript 接口', impact: '若加载不可信页面，恶意 JavaScript 可调用原生接口，导致远程代码执行风险。' }
    ],
    fix_guide: [
      { priority: 1, step: '移除客户端硬编码密钥', detail: '建议移除客户端硬编码密钥，改为服务端签发临时 Token。' },
      { priority: 2, step: '限制 WebView JS 接口暴露', detail: '仅向可信页面暴露最小接口，并校验 URL 来源。' },
      { priority: 3, step: '升级 HTTP 为 HTTPS', detail: '建议改用 HTTPS，并在服务端配置有效 TLS 证书。' }
    ],
    code_examples: [
      { for: '硬编码密钥修复', before: 'String apiKey = "sk-abc123def456";', after: 'String apiKey = fetchTokenFromServer();' },
      { for: 'WebView JS 接口安全', before: 'webView.addJavascriptInterface(new JsBridge(), "android");', after: 'if (url.startsWith("https://trusted.example.com")) { webView.addJavascriptInterface(new JsBridge(), "android"); }' }
    ]
  } as AiAnalysis
};

export function mockGetReport(_taskId: string): ReportData {
  return { ...mockReport, task_id: _taskId };
}