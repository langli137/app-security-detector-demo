import type { UploadResponse } from '@/types';

let mockTaskCounter = 0;

export function mockUpload(): UploadResponse {
  mockTaskCounter++;
  const taskId = `task_mock_${Date.now()}_${mockTaskCounter}`;
  return {
    task_id: taskId,
    filename: 'demo_vulnerable_source.zip',
    status: 'pending',
    engine: 'rules',
    message: '文件上传成功，检测任务已创建'
  };
}