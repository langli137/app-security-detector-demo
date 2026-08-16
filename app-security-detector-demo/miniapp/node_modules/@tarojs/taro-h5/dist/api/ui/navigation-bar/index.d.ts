/// <reference types="types/api" />
import Taro from '@tarojs/api';
/**
 * 展示导航栏 loading 状态
*/
export declare function showNavigationBarLoading(options?: Taro.showNavigationBarLoading.Option): Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare function setNavigationBarTitle(options?: Taro.setNavigationBarTitle.Option): Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/**
 * 设置页面导航条颜色
 */
export declare const setNavigationBarColor: typeof Taro.setNavigationBarColor;
/**
 * 隐藏导航栏 loading 状态
*/
export declare function hideNavigationBarLoading(options?: Taro.hideNavigationBarLoading.Option): Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const hideHomeButton: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
