interface EventOptions {
    bubbles: boolean;
    cancelable: boolean;
}
type Target = Record<string, unknown> & {
    dataset: Record<string, unknown>;
    id: string;
};
interface MpEvent {
    type: string;
    detail: Record<string, unknown>;
    target: Target;
    currentTarget: Target;
}

export type { EventOptions, MpEvent };
