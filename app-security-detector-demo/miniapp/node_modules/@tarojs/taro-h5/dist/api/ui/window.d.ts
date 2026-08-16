/// <reference types="types/api" />
import Taro from '@tarojs/api';
/**
 * 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
 */
export declare const setWindowSize: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/**
 * 监听窗口尺寸变化事件
 */
export declare const onWindowResize: typeof Taro.onWindowResize;
/**
 * 取消监听窗口尺寸变化事件
 */
export declare const offWindowResize: typeof Taro.offWindowResize;
export declare const checkIsPictureInPictureActive: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
