'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('node:path');
var helper = require('@tarojs/helper');
var shared = require('@tarojs/shared');

function _interopNamespaceCompat(e) {
    if (e && typeof e === 'object' && 'default' in e) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceCompat(path);

const { types: t, generate, traverse } = helper.babelKit;
var index = (ctx, options) => {
    const inlineElements = ['i', 'abbr', 'select', 'acronym', 'small', 'bdi', 'kbd', 'strong', 'big', 'sub', 'sup', 'br', 'mark', 'meter', 'template', 'cite', 'object', 'time', 'code', 'output', 'u', 'data', 'picture', 'tt', 'datalist', 'var', 'dfn', 'del', 'q', 'em', 's', 'embed', 'samp', 'b'];
    const blockElements = ['body', 'svg', 'address', 'fieldset', 'li', 'span', 'article', 'figcaption', 'main', 'aside', 'figure', 'nav', 'blockquote', 'footer', 'ol', 'details', 'p', 'dialog', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'dd', 'header', 'section', 'div', 'hgroup', 'table', 'dl', 'hr', 'ul', 'dt', 'view', 'view-block'];
    const specialElements = ['slot', 'form', 'iframe', 'img', 'audio', 'video', 'canvas', 'a', 'input', 'label', 'textarea', 'progress', 'button'];
    patchMappingElements(ctx, options, inlineElements, blockElements);
    // 默认允许使用 getBoundingClientRect 等 API
    ctx.modifyWebpackChain(({ chain }) => {
        chain
            .plugin('definePlugin')
            .tap(args => {
            var _a;
            args[0].ENABLE_SIZE_APIS = (_a = options.enableSizeAPIs) !== null && _a !== void 0 ? _a : true;
            return args;
        });
    });
    ctx.registerMethod({
        name: 'onSetupClose',
        fn(platform) {
            injectRuntimePath(platform);
        }
    });
    // 映射、收集使用到的小程序组件
    ctx.onParseCreateElement(({ nodeName, componentConfig }) => {
        if (!(inlineElements.includes(nodeName) ||
            blockElements.includes(nodeName) ||
            specialElements.includes(nodeName)))
            return;
        const simple = ['audio', 'button', 'canvas', 'form', 'label', 'progress', 'textarea', 'video'];
        const special = {
            a: ['navigator'],
            iframe: ['web-view'],
            img: ['image'],
            input: ['input', 'checkbox', 'radio']
        };
        const includes = componentConfig.includes;
        if (simple.includes(nodeName) && !includes.has(nodeName)) {
            includes.add(nodeName);
        }
        else if (nodeName in special) {
            const maps = special[nodeName];
            maps.forEach(item => {
                !includes.has(item) && includes.add(item);
            });
        }
    });
    // 修改 H5 postcss options
    ctx.modifyRunnerOpts(({ opts }) => {
        if (!(opts === null || opts === void 0 ? void 0 : opts.platform))
            return;
        modifyPostcssConfigs(opts, options, opts.platform === 'h5');
    });
};
function injectRuntimePath(platform) {
    const injectedPath = '@tarojs/plugin-html/dist/runtime';
    if (shared.isArray(platform.runtimePath)) {
        platform.runtimePath.push(injectedPath);
    }
    else if (shared.isString(platform.runtimePath)) {
        platform.runtimePath = [platform.runtimePath, injectedPath];
    }
}
function modifyPostcssConfigs(config, options, isH5) {
    config.postcss || (config.postcss = {});
    const postcssConfig = config.postcss;
    if (!isH5) {
        postcssConfig.htmltransform || (postcssConfig.htmltransform = {
            enable: true
        });
    }
    if (options.pxtransformBlackList) {
        postcssConfig.pxtransform || (postcssConfig.pxtransform = {
            enable: true
        });
        const pxtransformConfig = postcssConfig.pxtransform;
        if (pxtransformConfig.enable) {
            pxtransformConfig.config || (pxtransformConfig.config = {});
            const config = pxtransformConfig.config;
            config.selectorBlackList || (config.selectorBlackList = []);
            config.selectorBlackList = config.selectorBlackList.concat(options.pxtransformBlackList);
        }
    }
}
function patchMappingElements(ctx, options, inlineElements, blockElements) {
    var _a;
    const helper$1 = ctx.helper;
    const filePath = path__namespace.resolve(__dirname, './runtime.js');
    const content = helper$1.fs.readFileSync(filePath).toString();
    const ast = helper.babelKit.parse(content, { sourceType: 'unambiguous' });
    if (t.isNode(ast)) {
        (_a = options.modifyElements) === null || _a === void 0 ? void 0 : _a.call(options, inlineElements, blockElements);
        traverse(ast, {
            VariableDeclarator(path) {
                const node = path.node;
                const varId = node.id;
                if (varId.type === 'Identifier') {
                    if (varId.name === 'inlineElements') {
                        node.init = getNewExpression(inlineElements);
                    }
                    if (varId.name === 'blockElements') {
                        node.init = getNewExpression(blockElements);
                    }
                }
            }
        });
        const str = generate(ast).code;
        helper$1.fs.writeFileSync(filePath, str);
    }
}
function getNewExpression(elements) {
    return t.newExpression(t.identifier('Set'), [t.arrayExpression(elements.map(el => t.stringLiteral(el)))]);
}

exports.default = index;
//# sourceMappingURL=index.js.map
