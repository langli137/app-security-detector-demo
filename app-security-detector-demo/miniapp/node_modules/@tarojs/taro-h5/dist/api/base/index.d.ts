export declare const env: {
    FRAMEWORK: string | undefined;
    TARO_ENV: string | undefined;
    TARO_PLATFORM: string | undefined;
    TARO_VERSION: string | undefined;
};
export declare function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
export declare function base64ToArrayBuffer(base64: string): ArrayBufferLike;
export * from './crypto';
export * from './debug';
export * from './performance';
export * from './system';
export * from './update';
export * from './weapp/app-event';
export * from './weapp/life-cycle';
