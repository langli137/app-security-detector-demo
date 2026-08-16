import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUser } from '@/store/user';
import { getToolStatus, getRules } from '@/services/api';
import type { ToolStatus, RuleSummary } from '@/types';
import { useState, useEffect } from 'react';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { user, isLoggedIn, logout } = useUser();
  const [tools, setTools] = useState<ToolStatus | null>(null);
  const [rules, setRules] = useState<RuleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, r] = await Promise.all([getToolStatus(), getRules()]);
        setTools(t);
        setRules(r.rules);
      } catch (e) {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' });
  };

  const handleLogout = async () => {
    const res = await Taro.showModal({ title: '退出登录', content: '确定要退出登录吗？' });
    if (res.confirm) {
      await logout();
    }
  };

  const sevColor = (sev: string) => {
    if (sev === '高危' || sev === 'High') return '#EF4444';
    if (sev === '中危' || sev === 'Medium') return '#F59E0B';
    if (sev === '低危' || sev === 'Low') return '#6366F1';
    return '#94A3B8';
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        {isLoggedIn ? (
          <>
            <View className={styles.avatar}>
              <Text className={styles.avatarText}>🛡</Text>
            </View>
            <Text className={styles.nickname}>{user?.nickname || user?.username}</Text>
            <Text className={styles.username}>@{user?.username}</Text>
          </>
        ) : (
          <View className={styles.loginPrompt}>
            <Text className={styles.loginText}>登录后可同步历史记录</Text>
            <Button className={styles.btnLogin} onClick={handleLogin}>登录 / 注册</Button>
          </View>
        )}
      </View>

      {/* 系统工具状态 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>分析工具</Text>
        <View className={styles.card}>
          {loading ? (
            <Text className={styles.itemText}>加载中...</Text>
          ) : tools ? (
            <>
              <View className={styles.toolRow}>
                <Text className={styles.toolName}>apktool（APK 解码）</Text>
                <Text className={tools.apktool.available ? styles.toolOk : styles.toolWarn}>
                  {tools.apktool.available ? '✅ 可用' : '⚠️ 未安装（降级模式）'}
                </Text>
              </View>
              <View className={styles.toolRow}>
                <Text className={styles.toolName}>jadx（反编译）</Text>
                <Text className={tools.jadx.available ? styles.toolOk : styles.toolWarn}>
                  {tools.jadx.available ? '✅ 可用' : '⚠️ 未安装（降级模式）'}
                </Text>
              </View>
              <View className={styles.toolRow}>
                <Text className={styles.toolName}>规则引擎</Text>
                <Text className={styles.toolOk}>{tools.rules_count} 条规则</Text>
              </View>
              <View className={styles.toolRow}>
                <Text className={styles.toolName}>多 Agent</Text>
                <Text className={styles.toolOk}>{tools.agents_count} 个 Agent</Text>
              </View>
            </>
          ) : null}
        </View>
      </View>

      {/* 检测规则列表 */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>检测规则 ({rules.length})</Text>
        <View className={styles.card}>
          {rules.map((rule, idx) => (
            <View key={idx} className={styles.ruleItem}>
              <View className={styles.ruleLeft}>
                <View className={styles.ruleDot} style={{ background: sevColor(rule.severity) }} />
                <Text className={styles.ruleName}>{rule.name}</Text>
              </View>
              <Text className={styles.ruleCat}>{rule.category}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>关于</Text>
        <View className={styles.card}>
          <View className={styles.description}>
            AppSec Scanner v0.4.0{'\n'}
            基于静态规则 + AI 多 Agent 深度分析的移动应用安全检测平台。支持 APK/ZIP 上传，自动扫描安全漏洞、代码问题与上架合规性，提供智能修复建议。
            {'\n\n'}当前支持 {rules.length} 条扫描规则，覆盖网络通信、密钥泄露、权限隐私、WebView 风险、密码学、数据存储、组件安全、日志安全、代码安全等维度。
          </View>
        </View>
      </View>

      {isLoggedIn && (
        <View className={styles.section}>
          <Button className={styles.btnLogout} onClick={handleLogout}>退出登录</Button>
        </View>
      )}

      <View className={styles.bottomSafe} />
    </View>
  );
};

export default MinePage;