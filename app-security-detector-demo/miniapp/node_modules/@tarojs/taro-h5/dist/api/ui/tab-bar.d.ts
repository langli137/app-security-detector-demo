/// <reference types="types/api" />
import Taro, { AppConfig } from '@tarojs/api';
export declare function initTabBarApis(config?: AppConfig): void;
/**
 * 显示 tabBar 某一项的右上角的红点
 */
export declare const showTabBarRedDot: typeof Taro.showTabBarRedDot;
/**
 * 显示 tabBar
 */
export declare const showTabBar: typeof Taro.showTabBar;
/**
 * 动态设置 tabBar 的整体样式
 */
export declare const setTabBarStyle: typeof Taro.setTabBarStyle;
/**
 * 动态设置 tabBar 某一项的内容
 */
export declare const setTabBarItem: typeof Taro.setTabBarItem;
/**
 * 为 tabBar 某一项的右上角添加文本
 */
export declare const setTabBarBadge: typeof Taro.setTabBarBadge;
/**
 * 移除 tabBar 某一项右上角的文本
 */
export declare const removeTabBarBadge: typeof Taro.removeTabBarBadge;
/**
 * 隐藏 tabBar 某一项的右上角的红点
 */
export declare const hideTabBarRedDot: typeof Taro.hideTabBarRedDot;
/**
 * 隐藏 tabBar
 */
export declare const hideTabBar: typeof Taro.hideTabBar;
