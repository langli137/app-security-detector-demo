/// <reference types="types/api" />
import Taro from '@tarojs/api';
/** 跳转系统蓝牙设置页 */
export declare const openSystemBluetoothSetting: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 跳转系统微信授权管理页 */
export declare const openAppAuthorizeSetting: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 获取窗口信息 */
export declare const getWindowInfo: typeof Taro.getWindowInfo;
/** 获取设备设置 */
export declare const getSystemSetting: typeof Taro.getSystemSetting;
/** 获取设备设置 */
export declare const getDeviceInfo: typeof Taro.getDeviceInfo;
/** 获取微信APP基础信息 */
export declare const getAppBaseInfo: typeof Taro.getAppBaseInfo;
/** 获取微信APP授权设置 */
export declare const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting;
/** 获取设备设置 */
export declare const getSystemInfoSync: typeof Taro.getSystemInfoSync;
/** 获取系统信息 */
export declare const getSystemInfoAsync: typeof Taro.getSystemInfoAsync;
/** 获取系统信息 */
export declare const getSystemInfo: typeof Taro.getSystemInfo;
export declare const getSkylineInfoSync: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const getSkylineInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const getRendererUserAgent: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
