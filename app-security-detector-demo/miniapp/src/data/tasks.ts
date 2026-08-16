import type { TaskInfo } from '@/types';

const mockTasks: TaskInfo[] = [
  {
    task_id: 'task_mock_demo1',
    filename: 'demo_vulnerable_source.zip',
    status: 'success',
    progress: 100,
    stage: '检测完成',
    message: '报告已生成',
    score: 52,
    risk_level: '较高风险',
    error: null,
    created_at: '2026-08-04T22:00:00',
    updated_at: '2026-08-04T22:00:05'
  },
  {
    task_id: 'task_mock_demo2',
    filename: 'test_app.apk',
    status: 'success',
    progress: 100,
    stage: '检测完成',
    message: '报告已生成',
    score: 85,
    risk_level: '一般',
    error: null,
    created_at: '2026-08-03T18:30:00',
    updated_at: '2026-08-03T18:30:04'
  },
  {
    task_id: 'task_mock_demo3',
    filename: 'release_v1.0.apk',
    status: 'failed',
    progress: 100,
    stage: '检测失败',
    message: '扫描过程中发生异常',
    score: null,
    risk_level: null,
    error: '文件解析失败',
    created_at: '2026-08-02T10:15:00',
    updated_at: '2026-08-02T10:15:02'
  }
];

export function mockGetTask(taskId: string): TaskInfo {
  const task = mockTasks.find(t => t.task_id === taskId);
  if (!task) throw new Error('任务不存在');
  return { ...task };
}

export function mockGetTaskList(_limit: number = 20): TaskInfo[] {
  return mockTasks.map(t => ({ ...t }));
}