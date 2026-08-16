/// <reference types="types/api" />
import Taro from '@tarojs/api';
/**
 * 停止监听加速度数据。
 */
export declare const stopAccelerometer: typeof Taro.stopAccelerometer;
/**
 * 开始监听加速度数据。
 */
export declare const startAccelerometer: typeof Taro.startAccelerometer;
/**
 * 监听加速度数据事件。频率根据 Taro.startAccelerometer() 的 interval 参数。可使用 Taro.stopAccelerometer() 停止监听。
 */
export declare const onAccelerometerChange: typeof Taro.onAccelerometerChange;
/**
 * 取消监听加速度数据事件，参数为空，则取消所有的事件监听
 */
export declare const offAccelerometerChange: typeof Taro.offAccelerometerChange;
