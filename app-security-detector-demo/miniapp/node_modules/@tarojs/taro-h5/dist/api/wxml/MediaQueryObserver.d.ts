/// <reference types="types/api" />
import Taro from '@tarojs/api';
export declare class MediaQueryObserver implements Taro.MediaQueryObserver {
    private _mediaQueryObserver;
    private _listener;
    observe(descriptor: Taro.MediaQueryObserver.descriptor, callback: Taro.MediaQueryObserver.observeCallback): void;
    disconnect(): void;
}
