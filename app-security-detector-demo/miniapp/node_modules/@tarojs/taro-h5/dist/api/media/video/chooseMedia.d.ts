/// <reference types="types/api" />
import Taro from '@tarojs/api';
/**
 * 拍摄或从手机相册中选择图片或视频。
 */
export declare const chooseMedia: (options: Taro.chooseMedia.Option, methodName?: string) => Promise<Taro.chooseMedia.SuccessCallbackResult>;
