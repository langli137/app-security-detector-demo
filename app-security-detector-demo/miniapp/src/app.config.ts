export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/history/index',
    'pages/mine/index',
    'pages/login/index',
    'pages/progress/index',
    'pages/report/index',
    'pages/batch/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0F172A',
    navigationBarTitleText: '应用安全检测',
    navigationBarTextStyle: 'white'
  },
  // tabBar: {
  //   color: '#94A3B8',
  //   selectedColor: '#6366F1',
  //   backgroundColor: '#FFFFFF',
  //   borderStyle: 'white',
  //   list: [
  //     {
  //       pagePath: 'pages/index/index',
  //       text: '检测',
  //       iconPath: 'assets/tabbar/scan.svg',
  //       selectedIconPath: 'assets/tabbar/scan-selected.svg'
  //     },
  //     {
  //       pagePath: 'pages/history/index',
  //       text: '历史',
  //       iconPath: 'assets/tabbar/history.svg',
  //       selectedIconPath: 'assets/tabbar/history-selected.svg'
  //     },
  //     {
  //       pagePath: 'pages/mine/index',
  //       text: '我的',
  //       iconPath: 'assets/tabbar/mine.svg',
  //       selectedIconPath: 'assets/tabbar/mine-selected.svg'
  //     }
  //   ]
  // }
})