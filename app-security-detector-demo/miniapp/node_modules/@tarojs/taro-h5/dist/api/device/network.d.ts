/// <reference types="types/api" />
import Taro from '@tarojs/api';
export declare const getNetworkType: typeof Taro.getNetworkType;
/**
 * 在最近的八次网络请求中, 出现下列三个现象之一则判定弱网。
 * - 出现三次以上连接超时
 * - 出现三次 rtt 超过 400
 * - 出现三次以上的丢包
 * > 弱网事件通知规则是: 弱网状态变化时立即通知, 状态不变时 30s 内最多通知一次。
 */
export declare const onNetworkWeakChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const onNetworkStatusChange: typeof Taro.onNetworkStatusChange;
export declare const offNetworkWeakChange: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const offNetworkStatusChange: typeof Taro.offNetworkStatusChange;
export declare const getLocalIPAddress: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
