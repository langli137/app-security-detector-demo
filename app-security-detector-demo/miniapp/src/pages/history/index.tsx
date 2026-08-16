import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { getTaskList, deleteTask as apiDeleteTask, regenerateReport as apiRegenerateReport } from '@/services/api';
import type { TaskInfo } from '@/types';
import styles from './index.module.scss';

const HistoryPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getTaskList();
      setTasks(data);
    } catch (e: any) {
      setErrorMsg(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useDidShow(() => {
    loadData();
  });

  const handleTaskClick = (task: TaskInfo) => {
    if (task.status === 'success') {
      Taro.navigateTo({ url: `/pages/report/index?taskId=${task.task_id}` });
    } else if (task.status === 'running' || task.status === 'pending') {
      Taro.navigateTo({ url: `/pages/progress/index?taskId=${task.task_id}` });
    }
  };

  const handleDelete = async (e: any, taskId: string) => {
    e.stopPropagation();
    const res = await Taro.showModal({ title: '确认删除', content: '确定要删除这个任务吗？' });
    if (!res.confirm) return;
    try {
      await apiDeleteTask(taskId);
      Taro.showToast({ title: '已删除', icon: 'success' });
      loadData();
    } catch (e: any) {
      Taro.showToast({ title: e.message || '删除失败', icon: 'error' });
    }
  };

  const handleRegenerate = async (e: any, taskId: string) => {
    e.stopPropagation();
    try {
      await apiRegenerateReport(taskId);
      Taro.showToast({ title: '重新扫描已启动', icon: 'success' });
      Taro.navigateTo({ url: `/pages/progress/index?taskId=${taskId}` });
    } catch (e: any) {
      Taro.showToast({ title: e.message || '操作失败', icon: 'error' });
    }
  };

  const statusMap: Record<string, string> = {
    success: '已完成',
    failed: '失败',
    running: '检测中',
    pending: '等待中'
  };

  return (
    <View className={styles.page}>
      {loading ? (
        <View className={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      ) : errorMsg ? (
        <View className={styles.emptyContainer}>
          <Text className={styles.emptyIcon}>⚠️</Text>
          <Text className={styles.emptyText}>{errorMsg}</Text>
        </View>
      ) : tasks.length === 0 ? (
        <View className={styles.emptyContainer}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>暂无历史任务</Text>
        </View>
      ) : (
        <ScrollView scrollY>
          {tasks.map(task => (
            <View key={task.task_id} className={styles.listItem} onClick={() => handleTaskClick(task)}>
              <View className={styles.itemHeader}>
                <Text className={styles.itemName}>{task.filename}</Text>
                <View className={styles.itemActions}>
                  <Text className={`${styles.statusTag} ${styles[task.status] || ''}`}>
                    {statusMap[task.status] || task.status}
                  </Text>
                </View>
              </View>
              <View className={styles.itemMeta}>
                <Text className={styles.itemTime}>{task.created_at}</Text>
                {task.score != null && <Text className={styles.itemScore}>{task.score} 分</Text>}
              </View>
              <View className={styles.itemFooter}>
                <Text className={styles.itemId}>{task.task_id}</Text>
                <View className={styles.itemBtns}>
                  {task.status === 'success' && (
                    <Text className={styles.actionBtn} catchTap={(e) => handleRegenerate(e, task.task_id)}>
                      重新扫描
                    </Text>
                  )}
                  <Text className={`${styles.actionBtn} ${styles.actionDanger}`} catchTap={(e) => handleDelete(e, task.task_id)}>
                    删除
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <View className={styles.bottomSafe} />
    </View>
  );
};

export default HistoryPage;