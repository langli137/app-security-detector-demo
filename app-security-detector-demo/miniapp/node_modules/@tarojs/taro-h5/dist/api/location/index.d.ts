export declare const startLocationUpdateBackground: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const openLocation: (options?: Partial<{
    scale: number;
}>, ...args: any[]) => Promise<any>;
export { getLocation } from './getLocation';
export declare const choosePoi: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export declare const getFuzzyLocation: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
export { chooseLocation } from './chooseLocation';
export { offLocationChange, offLocationChangeError, onLocationChange, onLocationChangeError, startLocationUpdate, stopLocationUpdate } from './locationChange';
