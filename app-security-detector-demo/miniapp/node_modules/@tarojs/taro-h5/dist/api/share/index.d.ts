/** 更新转发属性 */
export declare const updateShareMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 显示当前页面的转发按钮 */
export declare const showShareMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载 */
export declare const showShareImageMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 转发视频到聊天 */
export declare const shareVideoMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 转发文件到聊天 */
export declare const shareFileMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 监听用户点击右上角菜单的「复制链接」按钮时触发的事件 */
export declare const onCopyUrl: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 移除用户点击右上角菜单的「复制链接」按钮时触发的事件的监听函数 */
export declare const offCopyUrl: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 隐藏当前页面的转发按钮 */
export declare const hideShareMenu: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 获取转发详细信息 */
export declare const getShareInfo: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
/** 验证私密消息。 */
export declare const authPrivateMessage: (option?: {}, ...args: any[]) => Promise<Partial<TaroGeneral.CallbackResult> & Record<string, unknown> & TaroGeneral.CallbackResult>;
