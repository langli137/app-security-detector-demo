import { Events } from '@tarojs/shared';
export { Events } from '@tarojs/shared';

declare const eventCenter: Events;
type EventsType = typeof Events;

export { eventCenter };
export type { EventsType };
