import { Events, eventCenter, nextTick, options, getCurrentInstance, Current } from '@tarojs/runtime';
import { ENV_TYPE, getEnv } from './env.js';
import Link, { interceptorify } from './interceptor/index.js';
import * as interceptors from './interceptor/interceptors.js';
import { getInitPxTransform, Behavior, getPreload, getPxTransform } from './tools.js';

/* eslint-disable camelcase */
const Taro = {
    Behavior,
    getEnv,
    ENV_TYPE,
    Link,
    interceptors,
    Current,
    getCurrentInstance,
    options,
    nextTick,
    eventCenter,
    Events,
    getInitPxTransform,
    interceptorify
};
Taro.initPxTransform = getInitPxTransform(Taro);
Taro.preload = getPreload(Current);
Taro.pxTransform = getPxTransform(Taro);

export { Taro as default };
//# sourceMappingURL=index.js.map
