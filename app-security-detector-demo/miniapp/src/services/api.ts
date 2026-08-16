import Taro from '@tarojs/taro';
import type {
  UploadResponse, TaskInfo, ReportData,
  ToolStatus, RuleSummary
} from '@/types';

const BASE_URL = 'http://10.0.2.2:8000';
const USE_MOCK = process.env.TARO_ENV === 'h5';

let _tokenGetter: (() => string) | null = null;

export function setTokenGetter(fn: () => string) {
  _tokenGetter = fn;
}

function getAuthHeader(): Record<string, string> {
  const token = _tokenGetter ? _tokenGetter() : '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ========== Mock ==========

async function mockUpload(): Promise<UploadResponse> {
  const mock = await import('@/data/upload');
  return mock.mockUpload();
}
async function mockGetTask(taskId: string): Promise<TaskInfo> {
  const mock = await import('@/data/tasks');
  return mock.mockGetTask(taskId);
}
async function mockGetTaskList(limit: number): Promise<TaskInfo[]> {
  const mock = await import('@/data/tasks');
  return mock.mockGetTaskList(limit);
}
async function mockGetReport(taskId: string): Promise<ReportData> {
  const mock = await import('@/data/report');
  return mock.mockGetReport(taskId);
}
async function mockGetToolStatus(): Promise<ToolStatus> {
  return {
    apktool: { available: false, path: '', description: 'APK 解码工具' },
    jadx: { available: false, path: '', description: 'DEX 反编译工具' },
    rules_count: 30,
    agents_count: 6,
    scan_modes: ['rules', 'agent'],
  };
}
async function mockGetRules(): Promise<{ rules: RuleSummary[]; total: number }> {
  const rules: RuleSummary[] = [
    { id: 'NET_001', name: '明文 HTTP 地址', severity: 'Medium', category: '网络通信', type: 'regex' },
    { id: 'SECRET_001', name: '硬编码密钥或 Token', severity: 'High', category: '密钥泄露', type: 'regex' },
    { id: 'WEBVIEW_002', name: 'WebView 暴露 JS 接口', severity: 'High', category: 'WebView 风险', type: 'keyword' },
  ];
  return { rules, total: rules.length };
}

// ========== API ==========

export async function uploadFile(filePath: string, _fileName: string, token?: string, engine: string = 'rules'): Promise<UploadResponse> {
  if (USE_MOCK) return mockUpload();
  const header: Record<string, string> = { 'Content-Type': 'multipart/form-data' };
  if (token) header['Authorization'] = `Bearer ${token}`;

  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${BASE_URL}/api/upload?engine=${encodeURIComponent(engine)}`,
      filePath,
      name: 'file',
      header,
      success(res) {
        try {
          const data = JSON.parse(res.data) as UploadResponse;
          resolve(data);
        } catch (e) {
          reject(new Error('解析响应失败'));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '上传失败'));
      }
    });
  });
}

export async function getTask(taskId: string): Promise<TaskInfo> {
  if (USE_MOCK) return mockGetTask(taskId);
  const res = await Taro.request<TaskInfo>({
    url: `${BASE_URL}/api/tasks/${taskId}`,
    method: 'GET'
  });
  return res.data;
}

export async function getTaskList(limit: number = 20): Promise<TaskInfo[]> {
  if (USE_MOCK) return mockGetTaskList(limit);
  const res = await Taro.request<TaskInfo[]>({
    url: `${BASE_URL}/api/tasks`,
    method: 'GET',
    data: { limit },
    header: getAuthHeader()
  });
  return res.data;
}

export async function getReport(taskId: string): Promise<ReportData> {
  if (USE_MOCK) return mockGetReport(taskId);
  const res = await Taro.request<ReportData>({
    url: `${BASE_URL}/api/reports/${taskId}`,
    method: 'GET'
  });
  return res.data;
}

export async function triggerAiAnalysis(taskId: string): Promise<any> {
  const res = await Taro.request({
    url: `${BASE_URL}/api/ai/analyze/${taskId}`,
    method: 'POST'
  });
  return res.data;
}

export async function deleteTask(taskId: string): Promise<any> {
  const token = _tokenGetter ? _tokenGetter() : '';
  const res = await Taro.request({
    url: `${BASE_URL}/api/tasks/${taskId}`,
    method: 'DELETE',
    header: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.data;
}

export async function regenerateReport(taskId: string): Promise<any> {
  const token = _tokenGetter ? _tokenGetter() : '';
  const res = await Taro.request({
    url: `${BASE_URL}/api/reports/${taskId}/regenerate`,
    method: 'POST',
    header: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.data;
}

export async function getToolStatus(): Promise<ToolStatus> {
  if (USE_MOCK) return mockGetToolStatus();
  const res = await Taro.request<ToolStatus>({
    url: `${BASE_URL}/api/system/tools`,
    method: 'GET'
  });
  return res.data;
}

export async function getRules(): Promise<{ rules: RuleSummary[]; total: number }> {
  if (USE_MOCK) return mockGetRules();
  const res = await Taro.request<{ rules: RuleSummary[]; total: number }>({
    url: `${BASE_URL}/api/rules`,
    method: 'GET'
  });
  return res.data;
}

export async function batchUpload(filePath: string, fileName: string, engine: string = 'rules'): Promise<any> {
  if (USE_MOCK) {
    return {
      task_id: 'task_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      filename: fileName,
      status: 'pending',
      engine
    };
  }
  const token = _tokenGetter ? _tokenGetter() : '';
  const header: Record<string, string> = {};
  if (token) header['Authorization'] = `Bearer ${token}`;
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: `${BASE_URL}/api/upload?engine=${encodeURIComponent(engine)}`,
      filePath,
      name: 'file',
      header,
      success(res) {
        try {
          resolve(JSON.parse(res.data));
        } catch (e) {
          reject(new Error('解析响应失败'));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '批量上传失败'));
      }
    });
  });
}

export async function downloadPdf(taskId: string): Promise<void> {
  if (USE_MOCK) {
    Taro.showToast({ title: '演示模式下无法下载PDF', icon: 'none' });
    return;
  }
  const res = await Taro.request({
    url: `${BASE_URL}/api/reports/${taskId}/pdf`,
    method: 'GET',
    responseType: 'file'
  });
  // Taro.request with responseType: 'file' returns a temp file path
  Taro.saveFile({ tempFilePath: res.data }).then((saveRes) => {
    Taro.showToast({ title: 'PDF 已保存', icon: 'success' });
  }).catch(() => {
    Taro.showToast({ title: '保存失败', icon: 'none' });
  });
}