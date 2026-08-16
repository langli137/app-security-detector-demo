/// <reference types="types/api" />
import Taro from '@tarojs/api';
export * from './saveVideoToPhotosAlbum';
export declare const openVideoEditor: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export * from './getVideoInfo';
/**
 * 创建 video 上下文 VideoContext 对象。
 */
export declare const createVideoContext: typeof Taro.createVideoContext;
export declare const compressVideo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export * from './chooseMedia';
export * from './chooseVideo';
