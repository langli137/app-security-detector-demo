import { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { getTask } from '@/services/api';
import type { TaskInfo } from '@/types';
import styles from './index.module.scss';

const ProgressPage: React.FC = () => {
  const router = useRouter();
  const taskId = router.params.taskId || '';
  const [task, setTask] = useState<TaskInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = async () => {
    try {
      const data = await getTask(taskId);
      setTask(data);
      console.log('[Progress]', data.progress, '%', data.status);

      if (data.status === 'success') {
        if (timerRef.current) clearInterval(timerRef.current);
        Taro.redirectTo({
          url: `/pages/report/index?taskId=${taskId}`
        });
      } else if (data.status === 'failed') {
        if (timerRef.current) clearInterval(timerRef.current);
        setErrorMsg(data.error || data.message || '检测失败');
      }
    } catch (e: any) {
      console.error('[Progress] poll error:', e);
      setErrorMsg(e.message || '查询进度失败');
    }
  };

  useEffect(() => {
    if (!taskId) return;
    poll();
    timerRef.current = setInterval(poll, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [taskId]);

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      <Text className={styles.icon}>🔍</Text>
      <Text className={styles.title}>正在检测</Text>
      <Text className={styles.taskId}>任务编号：{taskId}</Text>
      {task?.engine && (
        <Text className={styles.engineTag}>
          {(task as any).engine === 'multi-agent' ? '🤖 AI 多 Agent 引擎' : '📋 规则引擎'}
        </Text>
      )}

      <View className={styles.progressWrapper}>
        <View className={styles.progressBar}>
          <View
            className={styles.progressFill}
            style={{ width: `${task?.progress || 0}%` }}
          />
        </View>
        <Text className={styles.progressText}>{task?.progress || 0}%</Text>
      </View>

      {task && (
        <>
          <Text className={styles.stage}>{task.stage}</Text>
          <Text className={styles.message}>{task.message}</Text>
        </>
      )}

      {errorMsg && (
        <View className={styles.errorBox}>
          <Text className={styles.errorTitle}>检测异常</Text>
          <Text className={styles.errorDetail}>{errorMsg}</Text>
        </View>
      )}

      <Button className={styles.btnBack} onClick={handleBack}>
        返回首页
      </Button>
    </View>
  );
};

export default ProgressPage;