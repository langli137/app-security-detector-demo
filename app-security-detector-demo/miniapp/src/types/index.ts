// 类型定义 - 与后端 API 保持一致

export interface UploadResponse {
  task_id: string;
  filename: string;
  status: string;
  engine: string;
  message: string;
}

export interface TaskInfo {
  task_id: string;
  filename: string;
  status: string;
  progress: number;
  stage: string;
  message: string;
  engine: string;
  score: number | null;
  risk_level: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface RiskSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export interface AppInfo {
  filename: string;
  size_bytes: number;
  md5: string;
  sha256: string;
  scanned_files: number;
}

export interface Finding {
  rule_id: string;
  name: string;
  severity: string;
  category: string;
  file: string;
  line: number;
  evidence: string;
  description: string;
  suggestion: string;
}

// AI 深度分析结果
export interface AiAnalysis {
  risk_assessment: string;
  key_issues: Array<{ issue: string; impact: string }>;
  fix_guide: Array<{ priority: number; step: string; detail: string }>;
  code_examples: Array<{ for: string; before: string; after: string }>;
}

export interface ReportData {
  task_id: string;
  filename: string;
  generated_at: string;
  score: number;
  risk_level: string;
  summary: RiskSummary;
  app_info: AppInfo;
  findings: Finding[];
  disclaimer: string;
  ai_analysis?: AiAnalysis;
}

// 上架合规检查项
export interface ListingCheckItem {
  name: string;
  category: string;
  passed: boolean;
  detail: string;
}

// 系统工具状态
export interface ToolStatus {
  apktool: { available: boolean; path: string; description: string };
  jadx: { available: boolean; path: string; description: string };
  rules_count: number;
  agents_count: number;
  scan_modes: string[];
}

// 扫描规则摘要
export interface RuleSummary {
  id: string;
  name: string;
  severity: string;
  category: string;
  type: string;
}

// 上传请求参数
export interface UploadParams {
  filePath: string;
  fileName: string;
  engine?: 'rules' | 'agent';
  token?: string;
}