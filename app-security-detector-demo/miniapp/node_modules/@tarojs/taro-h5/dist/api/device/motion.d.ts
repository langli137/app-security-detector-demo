/// <reference types="types/api" />
import Taro from '@tarojs/api';
/**
 * 停止监听设备方向的变化。
 */
export declare const stopDeviceMotionListening: typeof Taro.stopDeviceMotionListening;
/**
 * 开始监听设备方向的变化。
 */
export declare const startDeviceMotionListening: typeof Taro.startDeviceMotionListening;
/**
 * 监听设备方向变化事件。
 */
export declare const onDeviceMotionChange: typeof Taro.onDeviceMotionChange;
/**
 * 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。
 */
export declare const offDeviceMotionChange: typeof Taro.offDeviceMotionChange;
