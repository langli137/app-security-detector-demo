declare function definePageConfig(config: Record<string, any>): Record<string, any>;
declare function defineAppConfig(config: Record<string, any>): Record<string, any>;

declare var process: { env: { TARO_ENV: string; NODE_ENV: string; [key: string]: string | undefined } };

// ========== react shim ==========
declare module 'react' {
  export type FC<P = {}> = (props: P & { children?: any }) => any;
  export type CSSProperties = Record<string, string | number | undefined>;
  export type ReactNode = any;
  export function useState<T>(initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(fn: () => (void | (() => void)), deps?: any[]): void;
  export function useRef<T>(initial?: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  export function useMemo<T>(fn: () => T, deps: any[]): T;
  export function createContext<T>(defaultValue: T): { Provider: FC<{ value: T; children?: any }>; Consumer: FC<{ children: (value: T) => any }> };
  export function useContext<T>(context: { Provider: FC<{ value: T; children?: any }>; Consumer: FC<{ children: (value: T) => any }> }): T;
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useCallback: typeof useCallback;
    useMemo: typeof useMemo;
    createContext: typeof createContext;
    useContext: typeof useContext;
  };
  export default React;
}

// ========== @tarojs/components shim ==========
declare module '@tarojs/components' {
  import type { CSSProperties, ReactNode, FC } from 'react';
  interface CommonProps {
    id?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    onClick?: (e: any) => void;
    onError?: (e: any) => void;
    onLoad?: (e: any) => void;
  }
  export const View: FC<CommonProps & {
    scrollY?: boolean;
    scrollX?: boolean;
    hoverClass?: string;
    onScroll?: (e: any) => void;
  }>;
  export const Text: FC<CommonProps & {
    selectable?: boolean;
    space?: string;
    decode?: boolean;
  }>;
  export const Button: FC<CommonProps & {
    disabled?: boolean;
    type?: string;
    size?: string;
    plain?: boolean;
    loading?: boolean;
    formType?: string;
    openType?: string;
    hoverClass?: string;
    onGetUserInfo?: (e: any) => void;
  }>;
  export const ScrollView: FC<CommonProps & {
    scrollY?: boolean;
    scrollX?: boolean;
    upperThreshold?: number;
    lowerThreshold?: number;
    scrollTop?: number;
    onScrollToUpper?: (e: any) => void;
    onScrollToLower?: (e: any) => void;
  }>;
  export const Image: FC<CommonProps & {
    src: string;
    mode?: string;
    lazyLoad?: boolean;
    onLoad?: (e: any) => void;
    onError?: (e: any) => void;
  }>;
  export const Input: FC<CommonProps & {
    value?: string;
    type?: string;
    password?: boolean;
    placeholder?: string;
    disabled?: boolean;
    maxlength?: number;
    onInput?: (e: any) => void;
    onConfirm?: (e: any) => void;
  }>;
  export const Swiper: FC<CommonProps>;
  export const SwiperItem: FC<CommonProps>;
}

// ========== @tarojs/taro shim ==========
declare module '@tarojs/taro' {
  interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    header?: Record<string, string>;
  }
  interface RequestResponse<T = any> {
    data: T;
    statusCode: number;
    header: Record<string, string>;
  }
  interface UploadFileOptions {
    url: string;
    filePath: string;
    name: string;
    header?: Record<string, string>;
    formData?: Record<string, string>;
    success?: (res: { data: string; statusCode: number }) => void;
    fail?: (err: { errMsg: string }) => void;
  }
  interface ChooseFileRes {
    tempFiles: { path: string; name: string; size: number }[];
  }
  interface RouterInfo {
    params: Record<string, string>;
    path: string;
  }

  function request<T = any>(options: RequestOptions): Promise<RequestResponse<T>>;
  function uploadFile(options: UploadFileOptions): any;
  function navigateTo(options: { url: string }): Promise<any>;
  function redirectTo(options: { url: string }): Promise<any>;
  function navigateBack(options?: { delta?: number }): Promise<any>;
  function getSystemInfoSync(): { windowWidth: number; windowHeight: number; platform: string };
  function showModal(options: { title: string; content: string }): Promise<{ confirm: boolean; cancel: boolean }>;
  function setStorageSync(key: string, data: any): void;
  function getStorageSync(key: string): any;
  function removeStorageSync(key: string): void;
  function chooseMessageFile(options: {
    count: number;
    type?: string;
    extension?: string[];
    success?: (res: ChooseFileRes) => void;
    fail?: (err: { errMsg: string }) => void;
  }): void;
  function useRouter(): RouterInfo;
  function useDidShow(callback: () => void): void;
  function useDidHide(callback: () => void): void;
  const Taro: {
    request: typeof request;
    uploadFile: typeof uploadFile;
    navigateTo: typeof navigateTo;
    redirectTo: typeof redirectTo;
    navigateBack: typeof navigateBack;
    getSystemInfoSync: typeof getSystemInfoSync;
    showModal: typeof showModal;
    setStorageSync: typeof setStorageSync;
    getStorageSync: typeof getStorageSync;
    removeStorageSync: typeof removeStorageSync;
    chooseMessageFile: typeof chooseMessageFile;
    useRouter: typeof useRouter;
    useDidShow: typeof useDidShow;
    useDidHide: typeof useDidHide;
  };
  export default Taro;
  export {
    request,
    uploadFile,
    navigateTo,
    redirectTo,
    navigateBack,
    getSystemInfoSync,
    showModal,
    setStorageSync,
    getStorageSync,
    removeStorageSync,
    chooseMessageFile,
    useRouter,
    useDidShow,
    useDidHide,
  };
}

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: 'development' | 'production',
    /** 当前构建的平台 */
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    TARO_APP_ID: string
  }
}
