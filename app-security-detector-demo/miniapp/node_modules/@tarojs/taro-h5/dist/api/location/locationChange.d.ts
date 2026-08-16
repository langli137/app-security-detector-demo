export declare function onLocationChange(callback: Taro.onLocationChange.Callback): void;
export declare function offLocationChange(callback: Taro.onLocationChange.Callback): void;
export declare function onLocationChangeError(callback: Taro.onLocationChange.Callback): void;
export declare function offLocationChangeError(callback: Taro.onLocationChange.Callback): void;
export declare const stopLocationUpdate: (options?: Partial<import("@tarojs/taro").stopLocationUpdate.Option>, ...args: any[]) => Promise<TaroGeneral.CallbackResult>;
export declare const startLocationUpdate: (options?: Partial<import("@tarojs/taro").startLocationUpdate.Option>, ...args: any[]) => Promise<TaroGeneral.CallbackResult>;
