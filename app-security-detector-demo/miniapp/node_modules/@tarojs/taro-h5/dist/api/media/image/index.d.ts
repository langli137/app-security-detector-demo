/// <reference types="types/api" />
import Taro from '@tarojs/api';
export * from './saveImageToPhotosAlbum';
export declare const previewMedia: typeof Taro.previewMedia;
export * from './getImageInfo';
export * from './previewImage';
export declare const compressImage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const chooseMessageFile: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export * from './chooseImage';
export declare const editImage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const cropImage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
