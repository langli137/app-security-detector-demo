import Taro$1, { AppConfig } from '@tarojs/api';
import styleInject from '/home/runner/work/taro/taro/node_modules/.pnpm/style-inject@0.3.0/node_modules/style-inject/dist/style-inject.es.js';
export { getCurrentPages, history, navigateBack, navigateTo, reLaunch, redirectTo, switchTab } from '@tarojs/router';
import * as _tarojs_taro from '@tarojs/taro';

declare const Behavior: any;
declare const getEnv: any;
declare const ENV_TYPE: any;
declare const Link: any;
declare const interceptors: any;
declare const interceptorify: any;
declare const Current: any;
declare const options: any;
declare const eventCenter: any;
declare const Events: any;
declare const preload: any;
type ModifiedTaro = Omit<typeof Taro$1, 'router'> & {
    router: any;
};
declare const taro: ModifiedTaro;
declare const requirePlugin: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const initPxTransform: ({ designWidth, deviceRatio, baseFontSize, unitPrecision, targetUnit }: {
    designWidth?: number | undefined;
    deviceRatio?: TaroGeneral.TDeviceRatio | undefined;
    baseFontSize?: number | undefined;
    unitPrecision?: number | undefined;
    targetUnit?: string | undefined;
}) => void;
declare const pxTransform: (size?: number) => any;
declare const canIUseWebp: () => boolean;
declare const getAppInfo: () => {
    platform: string;
    taroVersion: string;
    designWidth: any;
};

declare const createRewardedVideoAd: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createInterstitialAd: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const stopFaceDetect: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const initFaceDetect: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const faceDetect: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getInferenceEnvInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createInferenceSession: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const isVKSupport: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createVKSession: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getOpenUserInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const tradePay: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getUserCryptoManager: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const setEnableDebug: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getRealtimeLogManager: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getLogManager: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const reportPerformance: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getPerformance: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const preloadWebview: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const preloadSkylineView: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const preloadAssets: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/** 跳转系统蓝牙设置页 */
declare const openSystemBluetoothSetting: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 跳转系统微信授权管理页 */
declare const openAppAuthorizeSetting: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 获取窗口信息 */
declare const getWindowInfo: typeof Taro$1.getWindowInfo;
/** 获取设备设置 */
declare const getSystemSetting: typeof Taro$1.getSystemSetting;
/** 获取设备设置 */
declare const getDeviceInfo: typeof Taro$1.getDeviceInfo;
/** 获取微信APP基础信息 */
declare const getAppBaseInfo: typeof Taro$1.getAppBaseInfo;
/** 获取微信APP授权设置 */
declare const getAppAuthorizeSetting: typeof Taro$1.getAppAuthorizeSetting;
/** 获取设备设置 */
declare const getSystemInfoSync: typeof Taro$1.getSystemInfoSync;
/** 获取系统信息 */
declare const getSystemInfoAsync: typeof Taro$1.getSystemInfoAsync;
/** 获取系统信息 */
declare const getSystemInfo: typeof Taro$1.getSystemInfo;
declare const getSkylineInfoSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getSkylineInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getRendererUserAgent: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const updateWeChatApp: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getUpdateManager: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const onUnhandledRejection: typeof Taro$1.onUnhandledRejection;
declare const onThemeChange: typeof Taro$1.onThemeChange;
declare const onPageNotFound: typeof Taro$1.onPageNotFound;
declare const onLazyLoadError: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onError: typeof Taro$1.onError;
declare const onAudioInterruptionEnd: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onAudioInterruptionBegin: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onAppShow: typeof Taro$1.onAppShow;
declare const onAppHide: typeof Taro$1.onAppHide;
declare const offUnhandledRejection: typeof Taro$1.offUnhandledRejection;
declare const offThemeChange: typeof Taro$1.offThemeChange;
declare const offPageNotFound: typeof Taro$1.offPageNotFound;
declare const offLazyLoadError: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offError: typeof Taro$1.offError;
declare const offAudioInterruptionEnd: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offAudioInterruptionBegin: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offAppShow: typeof Taro$1.offAppShow;
declare const offAppHide: typeof Taro$1.offAppHide;

declare const getLaunchOptionsSync: typeof Taro$1.getLaunchOptionsSync;
declare const getEnterOptionsSync: typeof Taro$1.getEnterOptionsSync;

declare const env: {
    FRAMEWORK: string | undefined;
    TARO_ENV: string | undefined;
    TARO_PLATFORM: string | undefined;
    TARO_VERSION: string | undefined;
};
declare function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
declare function base64ToArrayBuffer(base64: string): ArrayBufferLike;

/**
 * 创建 canvas 的绘图上下文 CanvasContext 对象
 */
declare const createCanvasContext: typeof Taro$1.createCanvasContext;

/**
 * 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
 * @todo 暂未支持尺寸相关功能
 */
declare const canvasToTempFilePath: typeof Taro$1.canvasToTempFilePath;

/**
 * 将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件
 * @todo 暂未支持尺寸相关功能
 */
declare const canvasPutImageData: typeof Taro$1.canvasPutImageData;

/**
 * 获取 canvas 区域隐含的像素数据。
 */
declare const canvasGetImageData: typeof Taro$1.canvasGetImageData;

/** 创建离屏 canvas 实例 */
declare const createOffscreenCanvas: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare class cloud implements Taro$1.cloud {
    Cloud: new (options: Taro$1.cloud.IOptions) => Taro$1.Cloud;
    init: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    CloudID: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    callFunction: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    uploadFile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    downloadFile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    getTempFileURL: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    deleteFile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    database: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    callContainer: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
}

declare const reportMonitor: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const reportAnalytics: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const reportEvent: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getExptInfoSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 停止监听加速度数据。
 */
declare const stopAccelerometer: typeof Taro$1.stopAccelerometer;
/**
 * 开始监听加速度数据。
 */
declare const startAccelerometer: typeof Taro$1.startAccelerometer;
/**
 * 监听加速度数据事件。频率根据 Taro.startAccelerometer() 的 interval 参数。可使用 Taro.stopAccelerometer() 停止监听。
 */
declare const onAccelerometerChange: typeof Taro$1.onAccelerometerChange;
/**
 * 取消监听加速度数据事件，参数为空，则取消所有的事件监听
 */
declare const offAccelerometerChange: typeof Taro$1.offAccelerometerChange;

declare const checkIsOpenAccessibility: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getBatteryInfoSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBatteryInfo: typeof Taro$1.getBatteryInfo;

declare const stopBluetoothDevicesDiscovery: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startBluetoothDevicesDiscovery: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openBluetoothAdapter: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBluetoothDeviceFound: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBluetoothAdapterStateChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBluetoothDeviceFound: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBluetoothAdapterStateChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const makeBluetoothPair: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const isBluetoothDevicePaired: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getConnectedBluetoothDevices: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBluetoothDevices: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBluetoothAdapterState: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const closeBluetoothAdapter: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const writeBLECharacteristicValue: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setBLEMTU: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const readBLECharacteristicValue: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBLEMTUChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBLEConnectionStateChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBLECharacteristicValueChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBLEMTUChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBLEConnectionStateChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBLECharacteristicValueChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const notifyBLECharacteristicValueChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBLEMTU: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBLEDeviceServices: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBLEDeviceRSSI: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBLEDeviceCharacteristics: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createBLEConnection: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const closeBLEConnection: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const onBLEPeripheralConnectionStateChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBLEPeripheralConnectionStateChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createBLEPeripheralServer: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const addPhoneRepeatCalendar: typeof Taro$1.addPhoneRepeatCalendar;
declare const addPhoneCalendar: typeof Taro$1.addPhoneCalendar;

/**
 * 剪贴板部分的api参考了Chameleon项目的实现：
 *
 * setClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/setClipBoardData
 * getClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/getClipBoardData
 */

/**
 * 设置系统剪贴板的内容
 */
declare const setClipboardData: typeof Taro$1.setClipboardData;
/**
 * 获取系统剪贴板的内容
 */
declare const getClipboardData: typeof Taro$1.getClipboardData;

/**
 * 停止监听罗盘数据
 */
declare const stopCompass: typeof Taro$1.stopCompass;
/**
 * 开始监听罗盘数据
 */
declare const startCompass: typeof Taro$1.startCompass;
/**
 * 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 wx.stopCompass 停止监听。
 */
declare const onCompassChange: typeof Taro$1.onCompassChange;
/**
 * 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听。
 */
declare const offCompassChange: typeof Taro$1.offCompassChange;

declare const chooseContact: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const addPhoneContact: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getRandomValues: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const stopGyroscope: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startGyroscope: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onGyroscopeChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offGyroscopeChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const stopBeaconDiscovery: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startBeaconDiscovery: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBeaconUpdate: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBeaconServiceChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBeaconUpdate: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offBeaconServiceChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBeacons: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const onKeyboardHeightChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offKeyboardHeightChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const hideKeyboard: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getSelectedTextRange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const onMemoryWarning: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offMemoryWarning: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 停止监听设备方向的变化。
 */
declare const stopDeviceMotionListening: typeof Taro$1.stopDeviceMotionListening;
/**
 * 开始监听设备方向的变化。
 */
declare const startDeviceMotionListening: typeof Taro$1.startDeviceMotionListening;
/**
 * 监听设备方向变化事件。
 */
declare const onDeviceMotionChange: typeof Taro$1.onDeviceMotionChange;
/**
 * 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。
 */
declare const offDeviceMotionChange: typeof Taro$1.offDeviceMotionChange;

declare const getNetworkType: typeof Taro$1.getNetworkType;
/**
 * 在最近的八次网络请求中, 出现下列三个现象之一则判定弱网。
 * - 出现三次以上连接超时
 * - 出现三次 rtt 超过 400
 * - 出现三次以上的丢包
 * > 弱网事件通知规则是: 弱网状态变化时立即通知, 状态不变时 30s 内最多通知一次。
 */
declare const onNetworkWeakChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onNetworkStatusChange: typeof Taro$1.onNetworkStatusChange;
declare const offNetworkWeakChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offNetworkStatusChange: typeof Taro$1.offNetworkStatusChange;
declare const getLocalIPAddress: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const stopHCE: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startHCE: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const sendHCEMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onHCEMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offHCEMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getNFCAdapter: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getHCEState: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const makePhoneCall: typeof Taro$1.makePhoneCall;

declare const scanCode: (options?: Partial<{
    needResult: number;
}>, ...args: any[]) => Promise<any>;

declare const setVisualEffectOnCapture: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setScreenBrightness: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setKeepScreenOn: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onUserCaptureScreen: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offUserCaptureScreen: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getScreenBrightness: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onScreenRecordingStateChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offScreenRecordingStateChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getScreenRecordingState: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const sendSms: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
 */
declare const vibrateShort: typeof Taro$1.vibrateShort;
/**
 * 使手机发生较长时间的振动（400 ms)
 */
declare const vibrateLong: typeof Taro$1.vibrateLong;

declare const stopWifi: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startWifi: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setWifiList: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onWifiConnectedWithPartialInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onWifiConnected: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onGetWifiList: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offWifiConnectedWithPartialInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offWifiConnected: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offGetWifiList: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getWifiList: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getConnectedWifi: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const connectWifi: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getExtConfigSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getExtConfig: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const saveFileToDisk: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const saveFile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const removeSavedFile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openDocument: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getSavedFileList: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getSavedFileInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getFileSystemManager: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getFileInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getApp: typeof Taro$1.getApp;

declare const getCurrentInstance: () => Taro$1.getCurrentInstance.Current;

declare const getLocation: (options?: Partial<Taro$1.getLocation.Option>, ...args: any[]) => Promise<Taro$1.getLocation.SuccessCallbackResult>;

var css_248z = ".taro_choose_location{background-color:#fff;display:flex;flex-direction:column;height:100%;position:fixed;top:100%;transition:top .3s ease;width:100%;z-index:1}.taro_choose_location_bar{background-color:#ededed;color:#090909;display:flex;flex:0 95px;height:95px}.taro_choose_location_back{flex:0 45px;height:30px;margin-top:30px;position:relative;width:33px}.taro_choose_location_back:before{border:15px solid transparent;border-right-color:#090909;content:\"\";display:block;height:0;left:0;position:absolute;top:0;width:0}.taro_choose_location_back:after{border:15px solid transparent;border-right-color:#ededed;content:\"\";display:block;height:0;left:3px;position:absolute;top:0;width:0}.taro_choose_location_title{flex:1;line-height:95px;padding-left:30px}.taro_choose_location_submit{background-color:#08bf62;border:none;color:#fff;font-size:28px;height:60px;line-height:60px;margin:18px 30px 0 0;padding:0;width:110px}.taro_choose_location_frame{flex:1}";
styleInject(css_248z,{"insertAt":"top"});

/**
 * 打开地图选择位置。
 */
declare const chooseLocation: typeof Taro$1.chooseLocation;

declare function onLocationChange(callback: Taro.onLocationChange.Callback): void;
declare function offLocationChange(callback: Taro.onLocationChange.Callback): void;
declare function onLocationChangeError(callback: Taro.onLocationChange.Callback): void;
declare function offLocationChangeError(callback: Taro.onLocationChange.Callback): void;
declare const stopLocationUpdate: (options?: Partial<_tarojs_taro.stopLocationUpdate.Option>, ...args: any[]) => Promise<TaroGeneral.CallbackResult>;
declare const startLocationUpdate: (options?: Partial<_tarojs_taro.startLocationUpdate.Option>, ...args: any[]) => Promise<TaroGeneral.CallbackResult>;

declare const startLocationUpdateBackground: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openLocation: (options?: Partial<{
    scale: number;
}>, ...args: any[]) => Promise<any>;

declare const choosePoi: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getFuzzyLocation: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const stopVoice: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setInnerAudioOption: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const playVoice: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const pauseVoice: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getAvailableAudioSources: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createWebAudioContext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createMediaAudioPlayer: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/**
 * 创建内部 audio 上下文 InnerAudioContext 对象。
 */
declare const createInnerAudioContext: typeof Taro$1.createInnerAudioContext;
declare const createAudioContext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

type TCallbackManagerFunc<T extends unknown[] = unknown[]> = (...arr: T) => void;
interface ICallbackManagerOption<T extends unknown[] = unknown[]> {
    callback?: TCallbackManagerFunc<T>;
    ctx?: any;
    [key: string]: unknown;
}
type TCallbackManagerUnit<T extends unknown[] = unknown[]> = (TCallbackManagerFunc<T> | ICallbackManagerOption<T>);
declare class CallbackManager<T extends unknown[] = unknown[]> {
    callbacks: TCallbackManagerUnit<T>[];
    /** 添加回调 */
    add: (opt?: TCallbackManagerUnit<T>) => void;
    /** 移除回调 */
    remove: (opt?: TCallbackManagerUnit<T>) => void;
    /** 获取回调函数数量 */
    count: () => number;
    /** 触发回调 */
    trigger: (...args: T) => void;
    /** 清空所有回调 */
    clear: () => void;
}

declare class BackgroundAudioManager implements Taro$1.BackgroundAudioManager {
    Instance?: HTMLAudioElement;
    errorStack: CallbackManager;
    stopStack: CallbackManager;
    __startTime: number;
    constructor();
    set src(e: string);
    get src(): string;
    set startTime(e: number);
    get startTime(): number;
    set title(e: string);
    get title(): string;
    set epname(e: string);
    get epname(): string;
    set singer(e: string);
    get singer(): string;
    set coverImgUrl(e: string);
    get coverImgUrl(): string;
    set webUrl(e: string);
    get webUrl(): string;
    set protocol(e: string);
    get protocol(): string;
    set playbackRate(e: number);
    get playbackRate(): number;
    get duration(): number;
    get currentTime(): number;
    get paused(): boolean;
    get buffered(): number;
    set referrerPolicy(e: string);
    get referrerPolicy(): string;
    private setProperty;
    private dataset;
    play: () => Promise<void> | undefined;
    pause: () => void | undefined;
    seek: (position: number) => void;
    stop: () => void;
    onCanplay: (callback?: () => void) => void | undefined;
    onWaiting: (callback?: () => void) => void | undefined;
    onError: (callback?: ((res: Taro$1.InnerAudioContext.onErrorDetail) => void)) => void;
    onPlay: (callback?: () => void) => void | undefined;
    onPause: (callback?: () => void) => void | undefined;
    onSeeking: (callback?: () => void) => void | undefined;
    onSeeked: (callback?: () => void) => void | undefined;
    onEnded: (callback?: () => void) => void | undefined;
    onStop: (callback?: () => void) => void;
    onTimeUpdate: (callback?: () => void) => void | undefined;
    onPrev: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    onNext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    offCanplay: (callback?: () => void) => void | undefined;
    offWaiting: (callback?: () => void) => void | undefined;
    offError: (callback?: () => void) => void;
    offPlay: (callback?: () => void) => void | undefined;
    offPause: (callback?: () => void) => void | undefined;
    offSeeking: (callback?: () => void) => void | undefined;
    offSeeked: (callback?: () => void) => void | undefined;
    offEnded: (callback?: () => void) => void | undefined;
    offStop: (callback?: () => void) => void;
    offTimeUpdate: (callback?: () => void) => void | undefined;
    offPrev: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    offNext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
}

declare const stopBackgroundAudio: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const seekBackgroundAudio: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const playBackgroundAudio: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const pauseBackgroundAudio: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBackgroundAudioStop: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBackgroundAudioPlay: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBackgroundAudioPause: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBackgroundAudioPlayerState: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/**
 * 获取全局唯一的背景音频管理器
 */
declare const getBackgroundAudioManager: () => BackgroundAudioManager;

declare const createCameraContext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const saveImageToPhotosAlbum: typeof Taro$1.saveImageToPhotosAlbum;

/**
 * 获取图片信息。网络图片需先配置download域名才能生效。
 */
declare const getImageInfo: typeof Taro$1.getImageInfo;

/**
 * previewImage api基于开源的React组件[react-wx-images-viewer](https://github.com/react-ld/react-wx-images-viewer)开发，感谢！
 */
/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 */
declare const previewImage: typeof Taro$1.previewImage;

/**
 * 从本地相册选择图片或使用相机拍照。
 * @deprecated 请使用 chooseMedia 接口
 */
declare const chooseImage: typeof Taro$1.chooseImage;

declare const previewMedia: typeof Taro$1.previewMedia;

declare const compressImage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const chooseMessageFile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const editImage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const cropImage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createLivePusherContext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const createLivePlayerContext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createMapContext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createMediaRecorder: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const stopRecord: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startRecord: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getRecorderManager: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const saveVideoToPhotosAlbum: typeof Taro$1.saveVideoToPhotosAlbum;

declare const getVideoInfo: typeof Taro$1.getVideoInfo;

/**
 * 拍摄或从手机相册中选择图片或视频。
 */
declare const chooseMedia: (options: Taro$1.chooseMedia.Option, methodName?: string) => Promise<Taro$1.chooseMedia.SuccessCallbackResult>;

/**
 * 拍摄视频或从手机相册中选视频。
 * @deprecated 请使用 chooseMedia 接口
 */
declare const chooseVideo: typeof Taro$1.chooseVideo;

declare const openVideoEditor: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 创建 video 上下文 VideoContext 对象。
 */
declare const createVideoContext: typeof Taro$1.createVideoContext;
declare const compressVideo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createVideoDecoder: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createMediaContainer: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const updateVoIPChatMuteConfig: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const subscribeVoIPVideoMembers: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setEnable1v1Chat: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onVoIPVideoMembersChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onVoIPChatStateChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onVoIPChatSpeakersChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onVoIPChatMembersChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onVoIPChatInterrupted: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offVoIPChatSpeakersChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offVoIPVideoMembersChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offVoIPChatStateChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offVoIPChatMembersChanged: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offVoIPChatInterrupted: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const joinVoIPChat: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const join1v1Chat: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const exitVoIPChat: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const openEmbeddedMiniProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const navigateToMiniProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const navigateBackMiniProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const exitMiniProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openBusinessView: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 下载文件资源到本地。客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径。使用前请注意阅读相关说明。
 * 注意：请在服务端响应的 header 中指定合理的 Content-Type 字段，以保证客户端正确处理文件类型。
 */
declare const downloadFile: typeof Taro$1.downloadFile;

declare const stopLocalServiceDiscovery: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startLocalServiceDiscovery: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onLocalServiceResolveFail: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onLocalServiceLost: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onLocalServiceFound: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onLocalServiceDiscoveryStop: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offLocalServiceResolveFail: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offLocalServiceLost: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offLocalServiceFound: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const offLocalServiceDiscoveryStop: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const request: <T = any, U = any>(option: Taro$1.request.Option<T, U>) => Taro$1.RequestTask<T>;
declare const addInterceptor: any;
declare const cleanInterceptors: any;

declare const createTCPSocket: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createUDPSocket: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。使用前请注意阅读相关说明。
 */
declare const uploadFile: typeof Taro$1.uploadFile;

declare class SocketTask {
    ws: WebSocket;
    CONNECTING: number;
    OPEN: number;
    CLOSING: number;
    CLOSED: number;
    closeDetail: {
        code: any;
        reason: any;
    };
    _destroyWhenClose?: () => void;
    constructor(url: any, protocols: any);
    get readyState(): number;
    send(opts?: Partial<Taro$1.SocketTask.SendOption>): Promise<{
        errMsg: string;
    }>;
    close(opts?: Partial<Taro$1.SocketTask.CloseOption>): Promise<{
        errMsg: string;
    }>;
    onOpen(func: any): void;
    onMessage(func: any): void;
    onClose(func: any): void;
    onError(func: any): void;
}

declare function sendSocketMessage(): void;
declare function onSocketOpen(): void;
declare function onSocketMessage(): void;
declare function onSocketError(): void;
declare function onSocketClose(): void;
declare function connectSocket(options?: Taro.connectSocket.Option): Promise<unknown>;
declare function closeSocket(): void;

declare const getAccountInfoSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const chooseAddress: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const authorizeForMiniProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const authorize: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const openCard: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const addCard: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const reserveChannelsLive: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openChannelsUserProfile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openChannelsLive: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openChannelsEvent: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openChannelsActivity: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getChannelsShareKey: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getChannelsLiveNoticeInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getChannelsLiveInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const openCustomerServiceChat: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const requestDeviceVoIP: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getDeviceVoIPList: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const checkIsSupportFacialRecognition: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startFacialRecognitionVerify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const startFacialRecognitionVerifyAndUploadVideo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const faceVerifyForPay: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const addVideoToFavorites: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const addFileToFavorites: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getGroupEnterInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const chooseInvoiceTitle: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const chooseInvoice: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const chooseLicensePlate: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const pluginLogin: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const login: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const checkSession: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const checkIsAddedToMyMiniProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const requirePrivacyAuthorize: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const openPrivacyContract: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onNeedPrivacyAuthorization: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getPrivacySetting: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const showRedPackage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const openSetting: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getSetting: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const startSoterAuthentication: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const checkIsSupportSoterAuthentication: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const checkIsSoterEnrolledInDevice: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const requestSubscribeMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const requestSubscribeDeviceMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getUserProfile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getUserInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const shareToWeRun: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getWeRunData: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const requestPayment: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const requestPluginPayment: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const requestOrderPayment: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const openQzonePublish: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getQQRunData: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setOfficialDress: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setCustomDress: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const updateQQApp: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const addRecentColorSign: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getGuildInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const applyAddToMyApps: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const isAddedToMyApps: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const router: {
    addRouteBuilder: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    getRouteContext: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
    removeRouteBuilder: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
};

/** 更新转发属性 */
declare const updateShareMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 显示当前页面的转发按钮 */
declare const showShareMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载 */
declare const showShareImageMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 转发视频到聊天 */
declare const shareVideoMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 转发文件到聊天 */
declare const shareFileMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 监听用户点击右上角菜单的「复制链接」按钮时触发的事件 */
declare const onCopyUrl: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 移除用户点击右上角菜单的「复制链接」按钮时触发的事件的监听函数 */
declare const offCopyUrl: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 隐藏当前页面的转发按钮 */
declare const hideShareMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 获取转发详细信息 */
declare const getShareInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 验证私密消息。 */
declare const authPrivateMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const setBackgroundFetchToken: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const onBackgroundFetchData: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBackgroundFetchToken: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getBackgroundFetchData: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createCacheManager: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const setStorageSync: typeof Taro$1.setStorageSync;
declare const setStorage: typeof Taro$1.setStorage;
declare const revokeBufferURL: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const removeStorageSync: typeof Taro$1.removeStorageSync;
declare const removeStorage: typeof Taro$1.removeStorage;
declare const getStorageSync: typeof Taro$1.getStorageSync;
declare const getStorageInfoSync: typeof Taro$1.getStorageInfoSync;
declare const getStorageInfo: typeof Taro$1.getStorageInfo;
declare const getStorage: typeof Taro$1.getStorage;
declare const createBufferURL: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const clearStorageSync: typeof Taro$1.clearStorageSync;
declare const clearStorage: typeof Taro$1.clearStorage;
declare const batchSetStorageSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const batchSetStorage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const batchGetStorageSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const batchGetStorage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const setPageInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const ocrIdCard: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const ocrBankCard: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const ocrDrivingLicense: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const ocrVehicleLicense: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const textReview: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const textToAudio: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const imageAudit: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const advancedGeneralIdentify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const objectDetectIdentify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const carClassify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const dishClassify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const logoClassify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const animalClassify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const plantClassify: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const getSwanId: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const requestPolymerPayment: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const navigateToSmartGameProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const navigateToSmartProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const navigateBackSmartProgram: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const preloadSubPackage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createAnimation: typeof Taro$1.createAnimation;

declare const worklet: any;

declare const setBackgroundTextStyle: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const setBackgroundColor: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const nextTick: (callback: (...args: any[]) => any) => void;

declare const loadFontFace: typeof Taro$1.loadFontFace;

declare const showToast: typeof Taro$1.showToast;
declare const hideToast: typeof Taro$1.hideToast;
declare const showLoading: typeof Taro$1.showLoading;
declare const hideLoading: typeof Taro$1.hideLoading;
declare const showModal: typeof Taro$1.showModal;
declare const showActionSheet: (options?: Taro$1.showActionSheet.Option, methodName?: string) => Promise<Taro$1.showActionSheet.SuccessCallbackResult>;
declare const enableAlertBeforeUnload: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const disableAlertBeforeUnload: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const getMenuButtonBoundingClientRect: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 展示导航栏 loading 状态
*/
declare function showNavigationBarLoading(options?: Taro$1.showNavigationBarLoading.Option): Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare function setNavigationBarTitle(options?: Taro$1.setNavigationBarTitle.Option): Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/**
 * 设置页面导航条颜色
 */
declare const setNavigationBarColor: typeof Taro$1.setNavigationBarColor;
/**
 * 隐藏导航栏 loading 状态
*/
declare function hideNavigationBarLoading(options?: Taro$1.hideNavigationBarLoading.Option): Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
declare const hideHomeButton: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

/**
 * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
 */
declare const startPullDownRefresh: typeof Taro$1.startPullDownRefresh;
/**
 * 停止当前页面下拉刷新。
 */
declare const stopPullDownRefresh: typeof Taro$1.stopPullDownRefresh;

/**
 * 将页面滚动到目标位置
 */
declare const pageScrollTo: typeof Taro$1.pageScrollTo;

declare const setTopBarText: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare function initTabBarApis(config?: AppConfig): void;
/**
 * 显示 tabBar 某一项的右上角的红点
 */
declare const showTabBarRedDot: typeof Taro$1.showTabBarRedDot;
/**
 * 显示 tabBar
 */
declare const showTabBar: typeof Taro$1.showTabBar;
/**
 * 动态设置 tabBar 的整体样式
 */
declare const setTabBarStyle: typeof Taro$1.setTabBarStyle;
/**
 * 动态设置 tabBar 某一项的内容
 */
declare const setTabBarItem: typeof Taro$1.setTabBarItem;
/**
 * 为 tabBar 某一项的右上角添加文本
 */
declare const setTabBarBadge: typeof Taro$1.setTabBarBadge;
/**
 * 移除 tabBar 某一项右上角的文本
 */
declare const removeTabBarBadge: typeof Taro$1.removeTabBarBadge;
/**
 * 隐藏 tabBar 某一项的右上角的红点
 */
declare const hideTabBarRedDot: typeof Taro$1.hideTabBarRedDot;
/**
 * 隐藏 tabBar
 */
declare const hideTabBar: typeof Taro$1.hideTabBar;

/**
 * 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
 */
declare const setWindowSize: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/**
 * 监听窗口尺寸变化事件
 */
declare const onWindowResize: typeof Taro$1.onWindowResize;
/**
 * 取消监听窗口尺寸变化事件
 */
declare const offWindowResize: typeof Taro$1.offWindowResize;
declare const checkIsPictureInPictureActive: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

declare const createWorker: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;

interface ISelectorQueryQueue {
    component: TaroGeneral.IAnyObject;
    selector: string;
    single: boolean;
    fields: any;
}
type TSelectorQueryQueueCallback = (res: ISelectorQueryQueue) => void;
declare class SelectorQuery implements Taro$1.SelectorQuery {
    _defaultWebviewId: string | null;
    _webviewId: string | null;
    _queue: ISelectorQueryQueue[];
    _queueCb: (TSelectorQueryQueueCallback | null)[];
    _component?: TaroGeneral.IAnyObject;
    constructor();
    in(component: TaroGeneral.IAnyObject): this;
    select(selector: string): NodesRef;
    selectAll(selector: string): NodesRef;
    selectViewport(): NodesRef;
    exec(cb: any): Taro$1.NodesRef;
    _push(selector: string, component: any, single: any, fields: any, callback?: TSelectorQueryQueueCallback | null): void;
}

declare class NodesRef implements Taro$1.NodesRef {
    _component?: TaroGeneral.IAnyObject;
    _selector: string;
    _selectorQuery: SelectorQuery;
    _single: boolean;
    constructor(selector: string, querySelectorQuery: SelectorQuery, single: boolean);
    context(cb: any): SelectorQuery;
    node(cb: any): SelectorQuery;
    boundingClientRect(cb: any): SelectorQuery;
    scrollOffset(cb: any): SelectorQuery;
    fields(fields: any, cb: any): SelectorQuery;
}

declare const createSelectorQuery: typeof Taro$1.createSelectorQuery;
declare const createIntersectionObserver: typeof Taro$1.createIntersectionObserver;
declare const createMediaQueryObserver: typeof Taro$1.createMediaQueryObserver;

export { Behavior, Current, ENV_TYPE, Events, Link, NodesRef, SocketTask, addCard, addFileToFavorites, addInterceptor, addPhoneCalendar, addPhoneContact, addPhoneRepeatCalendar, addRecentColorSign, addVideoToFavorites, advancedGeneralIdentify, animalClassify, applyAddToMyApps, arrayBufferToBase64, authPrivateMessage, authorize, authorizeForMiniProgram, base64ToArrayBuffer, batchGetStorage, batchGetStorageSync, batchSetStorage, batchSetStorageSync, canIUseWebp, canvasGetImageData, canvasPutImageData, canvasToTempFilePath, carClassify, checkIsAddedToMyMiniProgram, checkIsOpenAccessibility, checkIsPictureInPictureActive, checkIsSoterEnrolledInDevice, checkIsSupportFacialRecognition, checkIsSupportSoterAuthentication, checkSession, chooseAddress, chooseContact, chooseImage, chooseInvoice, chooseInvoiceTitle, chooseLicensePlate, chooseLocation, chooseMedia, chooseMessageFile, choosePoi, chooseVideo, cleanInterceptors, clearStorage, clearStorageSync, closeBLEConnection, closeBluetoothAdapter, closeSocket, cloud, compressImage, compressVideo, connectSocket, connectWifi, createAnimation, createAudioContext, createBLEConnection, createBLEPeripheralServer, createBufferURL, createCacheManager, createCameraContext, createCanvasContext, createInferenceSession, createInnerAudioContext, createIntersectionObserver, createInterstitialAd, createLivePlayerContext, createLivePusherContext, createMapContext, createMediaAudioPlayer, createMediaContainer, createMediaQueryObserver, createMediaRecorder, createOffscreenCanvas, createRewardedVideoAd, createSelectorQuery, createTCPSocket, createUDPSocket, createVKSession, createVideoContext, createVideoDecoder, createWebAudioContext, createWorker, cropImage, taro as default, disableAlertBeforeUnload, dishClassify, downloadFile, editImage, enableAlertBeforeUnload, env, eventCenter, exitMiniProgram, exitVoIPChat, faceDetect, faceVerifyForPay, getAccountInfoSync, getApp, getAppAuthorizeSetting, getAppBaseInfo, getAppInfo, getAvailableAudioSources, getBLEDeviceCharacteristics, getBLEDeviceRSSI, getBLEDeviceServices, getBLEMTU, getBackgroundAudioManager, getBackgroundAudioPlayerState, getBackgroundFetchData, getBackgroundFetchToken, getBatteryInfo, getBatteryInfoSync, getBeacons, getBluetoothAdapterState, getBluetoothDevices, getChannelsLiveInfo, getChannelsLiveNoticeInfo, getChannelsShareKey, getClipboardData, getConnectedBluetoothDevices, getConnectedWifi, getCurrentInstance, getDeviceInfo, getDeviceVoIPList, getEnterOptionsSync, getEnv, getExptInfoSync, getExtConfig, getExtConfigSync, getFileInfo, getFileSystemManager, getFuzzyLocation, getGroupEnterInfo, getGuildInfo, getHCEState, getImageInfo, getInferenceEnvInfo, getLaunchOptionsSync, getLocalIPAddress, getLocation, getLogManager, getMenuButtonBoundingClientRect, getNFCAdapter, getNetworkType, getOpenUserInfo, getPerformance, getPrivacySetting, getQQRunData, getRandomValues, getRealtimeLogManager, getRecorderManager, getRendererUserAgent, getSavedFileInfo, getSavedFileList, getScreenBrightness, getScreenRecordingState, getSelectedTextRange, getSetting, getShareInfo, getSkylineInfo, getSkylineInfoSync, getStorage, getStorageInfo, getStorageInfoSync, getStorageSync, getSwanId, getSystemInfo, getSystemInfoAsync, getSystemInfoSync, getSystemSetting, getUpdateManager, getUserCryptoManager, getUserInfo, getUserProfile, getVideoInfo, getWeRunData, getWifiList, getWindowInfo, hideHomeButton, hideKeyboard, hideLoading, hideNavigationBarLoading, hideShareMenu, hideTabBar, hideTabBarRedDot, hideToast, imageAudit, initFaceDetect, initPxTransform, initTabBarApis, interceptorify, interceptors, isAddedToMyApps, isBluetoothDevicePaired, isVKSupport, join1v1Chat, joinVoIPChat, loadFontFace, login, logoClassify, makeBluetoothPair, makePhoneCall, navigateBackMiniProgram, navigateBackSmartProgram, navigateToMiniProgram, navigateToSmartGameProgram, navigateToSmartProgram, nextTick, notifyBLECharacteristicValueChange, objectDetectIdentify, ocrBankCard, ocrDrivingLicense, ocrIdCard, ocrVehicleLicense, offAccelerometerChange, offAppHide, offAppShow, offAudioInterruptionBegin, offAudioInterruptionEnd, offBLECharacteristicValueChange, offBLEConnectionStateChange, offBLEMTUChange, offBLEPeripheralConnectionStateChanged, offBeaconServiceChange, offBeaconUpdate, offBluetoothAdapterStateChange, offBluetoothDeviceFound, offCompassChange, offCopyUrl, offDeviceMotionChange, offError, offGetWifiList, offGyroscopeChange, offHCEMessage, offKeyboardHeightChange, offLazyLoadError, offLocalServiceDiscoveryStop, offLocalServiceFound, offLocalServiceLost, offLocalServiceResolveFail, offLocationChange, offLocationChangeError, offMemoryWarning, offNetworkStatusChange, offNetworkWeakChange, offPageNotFound, offScreenRecordingStateChanged, offThemeChange, offUnhandledRejection, offUserCaptureScreen, offVoIPChatInterrupted, offVoIPChatMembersChanged, offVoIPChatSpeakersChanged, offVoIPChatStateChanged, offVoIPVideoMembersChanged, offWifiConnected, offWifiConnectedWithPartialInfo, offWindowResize, onAccelerometerChange, onAppHide, onAppShow, onAudioInterruptionBegin, onAudioInterruptionEnd, onBLECharacteristicValueChange, onBLEConnectionStateChange, onBLEMTUChange, onBLEPeripheralConnectionStateChanged, onBackgroundAudioPause, onBackgroundAudioPlay, onBackgroundAudioStop, onBackgroundFetchData, onBeaconServiceChange, onBeaconUpdate, onBluetoothAdapterStateChange, onBluetoothDeviceFound, onCompassChange, onCopyUrl, onDeviceMotionChange, onError, onGetWifiList, onGyroscopeChange, onHCEMessage, onKeyboardHeightChange, onLazyLoadError, onLocalServiceDiscoveryStop, onLocalServiceFound, onLocalServiceLost, onLocalServiceResolveFail, onLocationChange, onLocationChangeError, onMemoryWarning, onNeedPrivacyAuthorization, onNetworkStatusChange, onNetworkWeakChange, onPageNotFound, onScreenRecordingStateChanged, onSocketClose, onSocketError, onSocketMessage, onSocketOpen, onThemeChange, onUnhandledRejection, onUserCaptureScreen, onVoIPChatInterrupted, onVoIPChatMembersChanged, onVoIPChatSpeakersChanged, onVoIPChatStateChanged, onVoIPVideoMembersChanged, onWifiConnected, onWifiConnectedWithPartialInfo, onWindowResize, openAppAuthorizeSetting, openBluetoothAdapter, openBusinessView, openCard, openChannelsActivity, openChannelsEvent, openChannelsLive, openChannelsUserProfile, openCustomerServiceChat, openDocument, openEmbeddedMiniProgram, openLocation, openPrivacyContract, openQzonePublish, openSetting, openSystemBluetoothSetting, openVideoEditor, options, pageScrollTo, pauseBackgroundAudio, pauseVoice, plantClassify, playBackgroundAudio, playVoice, pluginLogin, preload, preloadAssets, preloadSkylineView, preloadSubPackage, preloadWebview, previewImage, previewMedia, pxTransform, readBLECharacteristicValue, removeSavedFile, removeStorage, removeStorageSync, removeTabBarBadge, reportAnalytics, reportEvent, reportMonitor, reportPerformance, request, requestDeviceVoIP, requestOrderPayment, requestPayment, requestPluginPayment, requestPolymerPayment, requestSubscribeDeviceMessage, requestSubscribeMessage, requirePlugin, requirePrivacyAuthorize, reserveChannelsLive, revokeBufferURL, router, saveFile, saveFileToDisk, saveImageToPhotosAlbum, saveVideoToPhotosAlbum, scanCode, seekBackgroundAudio, sendHCEMessage, sendSms, sendSocketMessage, setBLEMTU, setBackgroundColor, setBackgroundFetchToken, setBackgroundTextStyle, setClipboardData, setCustomDress, setEnable1v1Chat, setEnableDebug, setInnerAudioOption, setKeepScreenOn, setNavigationBarColor, setNavigationBarTitle, setOfficialDress, setPageInfo, setScreenBrightness, setStorage, setStorageSync, setTabBarBadge, setTabBarItem, setTabBarStyle, setTopBarText, setVisualEffectOnCapture, setWifiList, setWindowSize, shareFileMessage, shareToWeRun, shareVideoMessage, showActionSheet, showLoading, showModal, showNavigationBarLoading, showRedPackage, showShareImageMenu, showShareMenu, showTabBar, showTabBarRedDot, showToast, startAccelerometer, startBeaconDiscovery, startBluetoothDevicesDiscovery, startCompass, startDeviceMotionListening, startFacialRecognitionVerify, startFacialRecognitionVerifyAndUploadVideo, startGyroscope, startHCE, startLocalServiceDiscovery, startLocationUpdate, startLocationUpdateBackground, startPullDownRefresh, startRecord, startSoterAuthentication, startWifi, stopAccelerometer, stopBackgroundAudio, stopBeaconDiscovery, stopBluetoothDevicesDiscovery, stopCompass, stopDeviceMotionListening, stopFaceDetect, stopGyroscope, stopHCE, stopLocalServiceDiscovery, stopLocationUpdate, stopPullDownRefresh, stopRecord, stopVoice, stopWifi, subscribeVoIPVideoMembers, textReview, textToAudio, tradePay, updateQQApp, updateShareMenu, updateVoIPChatMuteConfig, updateWeChatApp, uploadFile, vibrateLong, vibrateShort, worklet, writeBLECharacteristicValue };
//# sourceMappingURL=index.esm.d.ts.map
