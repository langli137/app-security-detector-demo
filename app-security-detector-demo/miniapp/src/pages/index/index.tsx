import { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { uploadFile } from '@/services/api';
import { useUser } from '@/store/user';
import styles from './index.module.scss';

const IndexPage: React.FC = () => {
  const { getToken } = useUser();
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [engine, setEngine] = useState<'rules' | 'agent'>('rules');

  const handleChooseFile = () => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['apk', 'zip', 'txt'],
      success(res) {
        const file = res.tempFiles[0];
        setFilePath(file.path);
        setFileName(file.name || 'unknown');
        setFileSize(formatSize(file.size));
        setErrorMsg('');
      },
      fail(err) {
        console.error('[Index] choose file error:', err);
        setErrorMsg('选择文件失败');
      }
    });
  };

  const handleUpload = async () => {
    if (!filePath) {
      setErrorMsg('请先选择文件');
      return;
    }
    setIsUploading(true);
    setErrorMsg('');

    try {
      const resp = await uploadFile(filePath, fileName, getToken(), engine);
      Taro.navigateTo({ url: `/pages/progress/index?taskId=${resp.task_id}` });
    } catch (e: any) {
      setErrorMsg(e.message || '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.hero}>
        <View className={styles.logoRow}>
          <View className={styles.logo}>
            <Text className={styles.logoIcon}>🛡</Text>
          </View>
          <Text className={styles.logoText}>AppSec Scanner</Text>
        </View>
        <Text className={styles.heroTitle}>应用安全检测</Text>
        <Text className={styles.heroDesc}>
          上传 APK 或源码 ZIP，AI 智能分析安全漏洞与上架合规性
        </Text>
      </View>

      <View className={styles.uploadCard}>
        {/* 扫描引擎选择 */}
        <View className={styles.engineRow}>
          <Text className={styles.engineLabel}>扫描引擎</Text>
          <View className={styles.engineOptions}>
            <View
              className={`${styles.engineOption} ${engine === 'rules' ? styles.engineActive : ''}`}
              onClick={() => setEngine('rules')}
            >
              <Text className={styles.engineName}>📋 规则引擎</Text>
              <Text className={styles.engineDesc}>30+ 静态规则，快速扫描</Text>
            </View>
            <View
              className={`${styles.engineOption} ${engine === 'agent' ? styles.engineActive : ''}`}
              onClick={() => setEngine('agent')}
            >
              <Text className={styles.engineName}>🤖 AI 多 Agent</Text>
              <Text className={styles.engineDesc}>6 个 Agent 深度分析</Text>
            </View>
          </View>
        </View>

        <View className={styles.uploadArea} onClick={handleChooseFile}>
          <View className={styles.uploadIconWrap}>
            <Text className={styles.uploadIcon}>📦</Text>
          </View>
          <Text className={styles.uploadHint}>点击选择 APK 或 ZIP 文件</Text>
          <Text className={styles.uploadSub}>支持 .apk / .zip / .txt 格式，最大 50MB</Text>
        </View>

        {fileName && (
          <View className={styles.fileInfo}>
            <Text className={styles.fileName}>{fileName}</Text>
            <Text className={styles.fileSize}>{fileSize}</Text>
          </View>
        )}

        <Button
          className={styles.btnUpload}
          disabled={!filePath || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? '检测中...' : '开始检测'}
        </Button>

        {errorMsg && <Text className={styles.errorText}>{errorMsg}</Text>}
      </View>

      <View className={styles.featureSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>检测能力</Text>
          <Text className={styles.sectionMore}>AI 驱动</Text>
        </View>
        <View className={styles.featureGrid}>
          <View className={styles.featureCard}>
            <Text className={styles.featureIcon}>🔐</Text>
            <Text className={styles.featureName}>安全漏洞</Text>
            <Text className={styles.featureDesc}>硬编码密钥、SSL绕过</Text>
          </View>
          <View className={styles.featureCard}>
            <Text className={styles.featureIcon}>🤖</Text>
            <Text className={styles.featureName}>AI 分析</Text>
            <Text className={styles.featureDesc}>多 Agent 深度诊断</Text>
          </View>
          <View className={styles.featureCard}>
            <Text className={styles.featureIcon}>📋</Text>
            <Text className={styles.featureName}>上架合规</Text>
            <Text className={styles.featureDesc}>Debug模式、权限检查</Text>
          </View>
          <View className={styles.featureCard}>
            <Text className={styles.featureIcon}>💡</Text>
            <Text className={styles.featureName}>整改建议</Text>
            <Text className={styles.featureDesc}>一键生成修复代码</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomSafe} />
    </View>
  );
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default IndexPage;