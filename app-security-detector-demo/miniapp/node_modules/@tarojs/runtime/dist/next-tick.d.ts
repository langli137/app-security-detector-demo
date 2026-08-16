import { TFunc } from './interface/utils.js';

declare const nextTick: (cb: TFunc, ctx?: Record<string, any>) => void;

export { nextTick };
