import { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { batchUpload } from '@/services/api';
import styles from './index.module.scss';

const BatchPage: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [engine, setEngine] = useState<'rules' | 'agent'>('rules');

  const pickFiles = async () => {
    const res = await Taro.chooseMessageFile({ count: 10, type: 'file', extension: ['zip', 'apk'] });
    setFiles(res.tempFiles);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);
    setResult(null);
    try {
      const results = [];
      for (const f of files) {
        const r = await batchUpload(f.tempFilePath, f.name, engine);
        results.push(r);
      }
      setResult({ total: results.length, tasks: results, engine });
      Taro.showToast({ title: `成功上传 ${results.length} 个文件`, icon: 'success' });
    } catch (e: any) {
      Taro.showToast({ title: e.message || '批量上传失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const engineLabel = engine === 'agent' ? '🤖 AI 多 Agent' : '📋 规则引擎';

  return (
    <View className={styles.page}>
      <Text className={styles.title}>批量上传检测</Text>
      <Text className={styles.desc}>选择多个 APK 或 ZIP 文件（最多 10 个），将自动排队逐一检测</Text>

      {/* 引擎选择 */}
      <View className={styles.engineRow}>
        <Text className={styles.engineLabel}>扫描引擎：</Text>
        <View className={styles.engineOptions}>
          <View
            className={`${styles.engineOption} ${engine === 'rules' ? styles.engineActive : ''}`}
            onClick={() => setEngine('rules')}
          >
            <Text className={styles.engineName}>📋 规则引擎</Text>
            <Text className={styles.engineDesc}>快速检测</Text>
          </View>
          <View
            className={`${styles.engineOption} ${engine === 'agent' ? styles.engineActive : ''}`}
            onClick={() => setEngine('agent')}
          >
            <Text className={styles.engineName}>🤖 AI 多 Agent</Text>
            <Text className={styles.engineDesc}>深度分析</Text>
          </View>
        </View>
      </View>

      <Button className={styles.btnPick} onClick={pickFiles}>
        选择文件 ({files.length}/10)
      </Button>

      {files.length > 0 && (
        <View className={styles.fileList}>
          {files.map((f, i) => (
            <View key={i} className={styles.fileItem}>
              <Text className={styles.fileIcon}>📦</Text>
              <Text className={styles.fileName}>{f.name}</Text>
              <Text className={styles.fileSize}>{(f.size / 1024).toFixed(1)} KB</Text>
            </View>
          ))}
        </View>
      )}

      {files.length > 0 && (
        <Button
          className={styles.btnUpload}
          onClick={handleUpload}
          disabled={loading}
          loading={loading}
        >
          {loading ? '上传中...' : `批量上传 (${engineLabel})`}
        </Button>
      )}

      {result && (
        <View className={styles.resultBox}>
          <Text className={styles.resultTitle}>上传完成</Text>
          <Text className={styles.resultText}>共 {result.total} 个文件，使用 {engineLabel}</Text>
          {result.tasks.map((t: any, i: number) => (
            <View key={i} className={styles.taskItem}>
              <Text className={styles.taskName}>{t.filename}</Text>
              <Text className={styles.taskId}>{t.task_id}</Text>
              <Text className={styles.taskStatus}>{t.status === 'pending' ? '⏳ 等待检测' : t.status}</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.bottomSafe} />
    </View>
  );
};

export default BatchPage;
