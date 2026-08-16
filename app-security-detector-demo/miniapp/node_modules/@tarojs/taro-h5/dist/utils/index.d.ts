import type { TaroElement } from '@tarojs/runtime';
export declare function shouldBeObject(target: unknown): {
    flag: boolean;
    msg?: undefined;
} | {
    flag: boolean;
    msg: string;
};
export declare function findDOM(inst?: any): TaroElement | HTMLElement | undefined;
interface IParameterErrorParam {
    name?: string;
    para?: string;
    correct?: string;
    wrong?: unknown;
    level?: 'warn' | 'error' | 'log' | 'info' | 'debug';
}
export declare function getParameterError({ name, para, correct, wrong, level }: IParameterErrorParam): string;
export declare function upperCaseFirstLetter(string: any): any;
export declare function inlineStyle(style: any): string;
export declare function setTransform(el: any, val: any): void;
export declare function serializeParams(params: any): string;
export declare function temporarilyNotSupport(name?: string): (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare function weixinCorpSupport(name: string): (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare function permanentlyNotSupport(name?: string): (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
interface IProcessOpenApi<TOptions = Record<string, unknown>, TResult extends TaroGeneral.CallbackResult = any> {
    name: string;
    defaultOptions?: TOptions;
    standardMethod?: (opts: TOptions) => Promise<TResult>;
    formatOptions?: (opts: TOptions) => TOptions;
    formatResult?: (res: TResult) => TResult;
}
export declare function processOpenApi<TOptions = Record<string, unknown>, TResult extends TaroGeneral.CallbackResult = any>({ name, defaultOptions, standardMethod, formatOptions, formatResult }: IProcessOpenApi<TOptions, TResult>): (options?: Partial<TOptions>, ...args: any[]) => Promise<TResult>;
/**
 * 获取当前页面路径
 * @returns
 */
export declare function getCurrentPath(): string;
export * from './animation';
export * from './helper';
export * from './valid';
