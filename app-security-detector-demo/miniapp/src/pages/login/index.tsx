import { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUser } from '@/store/user';
import styles from './index.module.scss';

const LoginPage: React.FC = () => {
  const { login, register } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMsg('请填写用户名和密码');
      return;
    }
    if (!isLogin && !nickname.trim()) {
      setNickname(username);
    }
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password, nickname.trim() || username.trim());
      }
      console.log('[Login] success');
      Taro.navigateBack();
    } catch (e: any) {
      console.error('[Login] error:', e);
      setErrorMsg(e.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.page}>
      <View className={styles.logoSection}>
        <View className={styles.logo}>
          <Text className={styles.logoIcon}>🛡️</Text>
        </View>
        <Text className={styles.appName}>AppSec Scanner</Text>
        <Text className={styles.appTagline}>移动应用安全检测平台</Text>
      </View>

      <View className={styles.formCard}>
        <View className={styles.tabRow}>
          <View
            className={`${styles.tab} ${isLogin ? styles.active : ''}`}
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
          >
            <Text>登录</Text>
          </View>
          <View
            className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
          >
            <Text>注册</Text>
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>用户名</Text>
          <Input
            className={styles.input}
            value={username}
            placeholder="请输入用户名"
            onInput={(e: any) => setUsername(e.detail.value)}
          />
        </View>

        {!isLogin && (
          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>昵称（选填）</Text>
            <Input
              className={styles.input}
              value={nickname}
              placeholder="给自己取个昵称"
              onInput={(e: any) => setNickname(e.detail.value)}
            />
          </View>
        )}

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>密码</Text>
          <Input
            className={styles.input}
            value={password}
            password
            placeholder="请输入密码（至少6位）"
            onInput={(e: any) => setPassword(e.detail.value)}
          />
        </View>

        <Button
          className={styles.btnSubmit}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? '处理中...' : (isLogin ? '登录' : '注册并登录')}
        </Button>

        {errorMsg && <Text className={styles.errorText}>{errorMsg}</Text>}

        <Text className={styles.skipText} onClick={handleSkip}>
          跳过登录，以游客身份使用
        </Text>
      </View>

      <View className={styles.bottomSafe} />
    </View>
  );
};

export default LoginPage;