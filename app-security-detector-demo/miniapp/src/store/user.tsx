import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Taro from '@tarojs/taro';

interface UserInfo {
  user_id: string;
  username: string;
  nickname: string;
  token: string;
}

interface UserContextType {
  user: UserInfo | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getToken: () => string;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  getToken: () => '',
});

const STORAGE_KEY = 'appsec_user';
const BASE_URL = 'http://10.0.2.2:8000';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  const saveUser = useCallback((u: UserInfo | null) => {
    setUser(u);
    if (u) {
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify(u));
    } else {
      Taro.removeStorageSync(STORAGE_KEY);
    }
  }, []);

  const getToken = useCallback(() => user?.token || '', [user]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await Taro.request({
      url: `${BASE_URL}/api/auth/login`,
      method: 'POST',
      data: { username, password },
      header: { 'Content-Type': 'application/json' }
    });
    if (res.statusCode !== 200) throw new Error((res.data as any)?.detail || '登录失败');
    const u = res.data as UserInfo;
    saveUser(u);
  }, [saveUser]);

  const register = useCallback(async (username: string, password: string, nickname: string) => {
    const res = await Taro.request({
      url: `${BASE_URL}/api/auth/register`,
      method: 'POST',
      data: { username, password, nickname },
      header: { 'Content-Type': 'application/json' }
    });
    if (res.statusCode !== 200) throw new Error((res.data as any)?.detail || '注册失败');
    const u = res.data as UserInfo;
    saveUser(u);
  }, [saveUser]);

  const logout = useCallback(async () => {
    try {
      await Taro.request({
        url: `${BASE_URL}/api/auth/logout`,
        method: 'POST',
        header: { Authorization: `Bearer ${getToken()}` }
      });
    } catch (_e) { /* ignore */ }
    saveUser(null);
  }, [saveUser, getToken]);

  const checkAuth = useCallback(async () => {
    const stored = Taro.getStorageSync(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserInfo;
        const res = await Taro.request({
          url: `${BASE_URL}/api/auth/me`,
          header: { Authorization: `Bearer ${parsed.token}` }
        });
        if (res.statusCode === 200) {
          saveUser({ ...parsed, ...(res.data as any) });
          return;
        }
      } catch (_e) { /* token expired */ }
    }
    saveUser(null);
  }, [saveUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, checkAuth, getToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);