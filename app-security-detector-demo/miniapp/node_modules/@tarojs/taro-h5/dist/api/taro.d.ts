/// <reference types="types/api" />
import Taro from '@tarojs/api';
import { history } from '@tarojs/router';
declare const Behavior: any, getEnv: any, ENV_TYPE: any, Link: any, interceptors: any, interceptorify: any, Current: any, options: any, eventCenter: any, Events: any, preload: any;
type ModifiedTaro = Omit<typeof Taro, 'router'> & {
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
export default taro;
export { Behavior, canIUseWebp, Current, ENV_TYPE, eventCenter, Events, getAppInfo, getEnv, history, initPxTransform, interceptorify, interceptors, Link, options, preload, pxTransform, requirePlugin };
