/// <reference types="types/api" />
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import Taro from '@tarojs/api';
export declare const request: <T = any, U = any>(option: Taro.request.Option<T, U>) => Taro.RequestTask<T>;
export declare const addInterceptor: any;
export declare const cleanInterceptors: any;
