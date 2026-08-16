import { DOCUMENT_FRAGMENT } from '../constants/index.js';
import { options } from '../options.js';

function getBoundingClientRectImpl() {
    if (!options.miniGlobal)
        return Promise.resolve(null);
    return new Promise(resolve => {
        const query = options.miniGlobal.createSelectorQuery();
        // ref: https://opendocs.alipay.com/mini/api/na4yun
        if (process.env.TARO_ENV === 'alipay') {
            query.select(`#${this.uid}`).boundingClientRect().exec(res => {
                resolve(res);
            });
            return;
        }
        query.select(`#${this.uid}`).boundingClientRect(res => {
            resolve(res);
        }).exec();
    });
}
function getTemplateContent(ctx) {
    if (ctx.nodeName === 'template') {
        const document = ctx.ownerDocument;
        const content = document.createElement(DOCUMENT_FRAGMENT);
        content.childNodes = ctx.childNodes;
        ctx.childNodes = [content];
        content.parentNode = ctx;
        content.childNodes.forEach(nodes => {
            nodes.parentNode = content;
        });
        return content;
    }
}

export { getBoundingClientRectImpl, getTemplateContent };
//# sourceMappingURL=element.js.map
