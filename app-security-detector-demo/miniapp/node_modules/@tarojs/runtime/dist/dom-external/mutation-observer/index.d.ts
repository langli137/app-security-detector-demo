import { MutationObserverImpl, MutationCallback, MutationObserverInit } from './implements.js';
import { MutationRecord } from './record.js';
export { MutationRecordType } from './record.js';
import { TaroNode } from '../../dom/node.js';

declare class MutationObserver {
    core: Pick<MutationObserverImpl, 'observe' | 'disconnect' | 'takeRecords'>;
    constructor(callback: MutationCallback);
    observe(...args: [TaroNode, MutationObserverInit?]): void;
    disconnect(): void;
    takeRecords(): MutationRecord[];
    static record(record: MutationRecord): void;
}

export { MutationObserver };
