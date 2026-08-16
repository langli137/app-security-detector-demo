interface EventListenerOptions {
    capture?: boolean;
}
interface AddEventListenerOptions extends EventListenerOptions {
    once?: boolean;
    passive?: boolean;
}
interface EventHandler<T = any, R = void> {
    (...args: T[]): R;
    _stop?: boolean;
}

export type { AddEventListenerOptions, EventHandler, EventListenerOptions };
