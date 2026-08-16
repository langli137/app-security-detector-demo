import { TaroElement } from './element.js';
import { MpInstance } from '../interface/hydrate.js';
import { UpdatePayload } from '../interface/node.js';
import { TFunc } from '../interface/utils.js';

declare class TaroRootElement extends TaroElement {
    private updatePayloads;
    private updateCallbacks;
    pendingUpdate: boolean;
    ctx: null | MpInstance;
    constructor();
    get _path(): string;
    get _root(): TaroRootElement;
    scheduleTask(fn: TFunc): void;
    enqueueUpdate(payload: UpdatePayload): void;
    performUpdate(initRender?: boolean, prerender?: TFunc): void;
    enqueueUpdateCallback(cb: TFunc, ctx?: Record<string, any>): void;
    flushUpdateCallback(): void;
}

export { TaroRootElement };
