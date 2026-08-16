import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { getReport, downloadPdf } from '@/services/api';
import type { ReportData, AiAnalysis } from '@/types';
import styles from './index.module.scss';

const ReportPage: React.FC = () => {
  const router = useRouter();
  const taskId = router.params.taskId || '';
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    getReport(taskId)
      .then(data => { setReport(data); })
      .catch(e => { setErrorMsg(e.message || '报告加载失败'); })
      .finally(() => setLoading(false));
  }, [taskId]);

  const getScoreClass = (score: number) => {
    if (score >= 90) return 'safe';
    if (score >= 70) return 'moderate';
    if (score >= 40) return 'risky';
    return 'danger';
  };

  if (loading) {
    return <View className={styles.page}><View className={styles.loadingContainer}><Text>加载中...</Text></View></View>;
  }

  if (errorMsg || !report) {
    return <View className={styles.page}><View className={styles.emptyText}>{errorMsg || '暂无数据'}</View></View>;
  }

  const scoreClass = getScoreClass(report.score);
  const s = report.summary;
  const aiAnalysis = report.ai_analysis;

  return (
    <ScrollView className={styles.page} scrollY>
      {/* 评分卡片 */}
      <View className={styles.scoreCard}>
        <View className={`${styles.scoreCircle} ${styles[scoreClass]}`}>
          <Text className={`${styles.scoreNum} ${styles[scoreClass]}`}>{report.score}</Text>
          <Text className={styles.scoreUnit}>分</Text>
        </View>
        <Text className={styles.riskLevel}>{report.risk_level}</Text>

        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum} style={{ color: '#EF4444' }}>{s.high}</Text>
            <Text className={styles.summaryLabel}>高危</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum} style={{ color: '#EAB308' }}>{s.medium}</Text>
            <Text className={styles.summaryLabel}>中危</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum} style={{ color: '#818CF8' }}>{s.low}</Text>
            <Text className={styles.summaryLabel}>低危</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum}>{s.info}</Text>
            <Text className={styles.summaryLabel}>信息</Text>
          </View>
        </View>
      </View>

      {/* 文件信息 */}
      <View className={styles.infoCard}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>文件</Text>
          <Text className={styles.infoValue}>{report.filename}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>大小</Text>
          <Text className={styles.infoValue}>{formatSize(report.app_info.size_bytes)}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>扫描引擎</Text>
          <Text className={styles.infoValue}>
            {(report as any).engine === 'multi-agent' ? '🤖 AI 多 Agent' : '📋 规则引擎'}
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>扫描文件</Text>
          <Text className={styles.infoValue}>{report.app_info.scanned_files} 个</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>SHA256</Text>
          <Text className={styles.infoValue}>{report.app_info.sha256.substring(0, 20)}...</Text>
        </View>
      </View>

      {/* AI 深度分析 */}
      {aiAnalysis && (
        <View className={styles.aiCard}>
          <View className={styles.aiHeader}>
            <Text className={styles.aiBadge}>AI</Text>
            <Text className={styles.aiTitle}>深度分析</Text>
          </View>
          <Text className={styles.aiAssessment}>{aiAnalysis.risk_assessment}</Text>

          {aiAnalysis.key_issues?.length > 0 && (
            <>
              <Text className={styles.aiTitle} style={{ marginTop: '16rpx', marginBottom: '8rpx' }}>关键问题</Text>
              {aiAnalysis.key_issues.map((iss: any, i: number) => (
                <View key={i} className={styles.aiIssue}>
                  <Text className={styles.aiIssueName}>{iss.issue}</Text>
                  <Text className={styles.aiIssueImpact}>{iss.impact}</Text>
                </View>
              ))}
            </>
          )}

          {aiAnalysis.fix_guide?.length > 0 && (
            <View className={styles.aiFixGuide}>
              <Text className={styles.aiTitle} style={{ marginBottom: '8rpx' }}>修复步骤</Text>
              {aiAnalysis.fix_guide.map((step: any, i: number) => (
                <View key={i} className={styles.aiFixStep}>
                  <Text className={styles.aiFixNum}>{step.priority}</Text>
                  <Text className={styles.aiFixDetail}>{step.detail}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 风险详情 */}
      <View className={styles.findingsSection}>
        <Text className={styles.sectionTitle}>风险详情 ({report.findings.length})</Text>
        {report.findings.length === 0 ? (
          <Text className={styles.emptyText}>未发现明显风险</Text>
        ) : (
          report.findings.map((f, idx) => (
            <View key={idx} className={styles.findingCard}>
              <View className={styles.findingHeader}>
                <Text className={styles.findingName}>{f.name}</Text>
                <Text className={`${styles.severityBadge} ${styles[f.severity.toLowerCase()] || ''}`}>
                  {f.severity}
                </Text>
              </View>
              <Text className={styles.findingCat}>类别：{f.category}</Text>
              <Text className={styles.findingFile}>位置：{f.file}:{f.line}</Text>
              <Text className={styles.findingEvid}>证据：{f.evidence}</Text>
              <Text className={styles.findingDesc}>{f.description}</Text>
              <Text className={styles.findingSug}>建议：{f.suggestion}</Text>
            </View>
          ))
        )}
      </View>

      <Text className={styles.disclaimer}>{report.disclaimer}</Text>

      {/* 导出操作 */}
      <View className={styles.exportRow}>
        <Button className={styles.btnExport} size="mini" onClick={() => downloadPdf(report.task_id)}>
          📄 导出 PDF 报告
        </Button>
      </View>

      <View className={styles.bottomSafe} />
    </ScrollView>
  );
};

function formatSize(bytes: number): string {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default ReportPage;