import { SocketTask } from './socketTask';
export declare function sendSocketMessage(): void;
export declare function onSocketOpen(): void;
export declare function onSocketMessage(): void;
export declare function onSocketError(): void;
export declare function onSocketClose(): void;
export declare function connectSocket(options?: Taro.connectSocket.Option): Promise<unknown>;
export declare function closeSocket(): void;
export { SocketTask };
