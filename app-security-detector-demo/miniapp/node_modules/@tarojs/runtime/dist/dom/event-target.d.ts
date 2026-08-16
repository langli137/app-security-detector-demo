import { EventHandler, AddEventListenerOptions } from '../interface/event-target.js';

declare class TaroEventTarget {
    __handlers: Record<string, EventHandler[]>;
    addEventListener(type: string, handler: EventHandler, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, handler: EventHandler): void;
    isAnyEventBinded(): boolean;
    isOnlyClickBinded(): boolean;
}

export { TaroEventTarget };
