import { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { UserProvider } from '@/store/user';
// 全局样式
import './app.scss';

function App(props) {
  useEffect(() => {});

  useDidShow(() => {});

  useDidHide(() => {});

  return <UserProvider>{props.children}</UserProvider>;
}

export default App;
