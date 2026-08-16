declare let now: () => number;
declare const _raf: typeof requestAnimationFrame | ((callback: any) => NodeJS.Timeout);
declare const _caf: typeof cancelAnimationFrame;

export { _caf as caf, now, _raf as raf };
