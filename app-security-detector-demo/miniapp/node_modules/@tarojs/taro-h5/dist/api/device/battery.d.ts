/// <reference types="types/api" />
import Taro from '@tarojs/api';
export declare const getBatteryInfoSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const getBatteryInfo: typeof Taro.getBatteryInfo;
