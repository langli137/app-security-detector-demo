'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var path = require('node:path');
var core = require('@babel/core');
var helper = require('@tarojs/helper');
var service = require('@tarojs/service');

const compLibraryAlias = {
    vue3: 'vue3',
    solid: 'solid',
};
const PACKAGE_NAME = '@tarojs/plugin-platform-h5';
class H5 extends service.TaroPlatformWeb {
    constructor(ctx, config) {
        super(ctx, config);
        this.platform = 'h5';
        this.runtimePath = `${PACKAGE_NAME}/dist/runtime`;
        this.mainFields = [...helper.defaultMainFields];
        this.setupTransaction.addWrapper({
            close() {
                this.compiler === 'webpack5' ? this.modifyWebpackConfig() : this.modifyViteConfig();
            },
        });
    }
    get framework() {
        return this.ctx.initialConfig.framework || 'react';
    }
    get useHtmlComponents() {
        var _a;
        return !!((_a = this.ctx.initialConfig.h5) === null || _a === void 0 ? void 0 : _a.useHtmlComponents);
    }
    get useDeprecatedAdapterComponent() {
        var _a;
        return !!((_a = this.ctx.initialConfig.h5) === null || _a === void 0 ? void 0 : _a.useDeprecatedAdapterComponent);
    }
    get apiLibrary() {
        return require.resolve('./runtime/apis');
    }
    get aliasFramework() {
        return compLibraryAlias[this.framework] || 'react';
    }
    get componentLibrary() {
        if (this.useHtmlComponents && this.aliasFramework === 'react') {
            if (this.framework === 'solid') {
                return require.resolve('@tarojs/components-react/dist/solid');
            }
            return require.resolve('./runtime/components');
        }
        else if (this.useDeprecatedAdapterComponent) {
            return require.resolve(`@tarojs/components/lib/${this.aliasFramework}/component-lib`);
        }
        else {
            return require.resolve(`@tarojs/components/lib/${this.aliasFramework}`);
        }
    }
    get componentAdapter() {
        return path.join(path.dirname(require.resolve('@tarojs/components')), '..', 'lib');
    }
    get routerLibrary() {
        const name = '@tarojs/router';
        return (helper.resolveSync(name, {
            // basedir: this.ctx.paths.appPath,
            mainFields: this.mainFields,
        }) || name);
    }
    get libraryDefinition() {
        return helper.resolveSync('./definition.json', {
            basedir: __dirname,
        });
    }
    /**
     * 修改 Webpack 配置
     */
    modifyWebpackConfig() {
        var _a, _b;
        (_b = (_a = this.ctx).modifyWebpackChain) === null || _b === void 0 ? void 0 : _b.call(_a, ({ chain }) => {
            // Note: 更新 mainFields 配置，确保 resolveSync 能正确读取到相关依赖入口文件
            const mainFields = chain.resolve.mainFields.values() || [...helper.defaultMainFields];
            if (mainFields.length > 0) {
                this.mainFields = mainFields;
            }
            const rules = chain.module.rules;
            const script = rules.get('script');
            const babelLoader = script.uses.get('babelLoader');
            const options = babelLoader.get('options');
            babelLoader.set('options', Object.assign(Object.assign({}, options), { plugins: [
                    ...(options.plugins || []),
                    [
                        require('babel-plugin-transform-taroapi'),
                        {
                            packageName: '@tarojs/taro',
                            definition: require(this.libraryDefinition),
                        },
                    ],
                ] }));
            const alias = chain.resolve.alias;
            // TODO 考虑集成到 taroComponentsPath 中，与小程序端对齐
            alias.set('@tarojs/components$', this.componentLibrary);
            alias.set('@tarojs/components/lib', this.componentAdapter);
            alias.set('@tarojs/router$', this.routerLibrary);
            alias.set('@tarojs/taro', this.apiLibrary);
            chain.plugin('mainPlugin').tap((args) => {
                var _a;
                (_a = args[0]).loaderMeta || (_a.loaderMeta = {
                    extraImportForWeb: '',
                    execBeforeCreateWebApp: '',
                });
                // Note: 旧版本适配器不会自动注册 Web Components 组件，需要加载 defineCustomElements 脚本自动注册使用的组件
                if (this.useDeprecatedAdapterComponent) {
                    args[0].loaderMeta.extraImportForWeb += `import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'\n`;
                    args[0].loaderMeta.execBeforeCreateWebApp += `applyPolyfills().then(() => defineCustomElements(window))\n`;
                }
                if (!this.useHtmlComponents) {
                    args[0].loaderMeta.extraImportForWeb += `import { defineCustomElementTaroPullToRefreshCore } from '@tarojs/components/dist/components'\n`;
                    args[0].loaderMeta.execBeforeCreateWebApp += `defineCustomElementTaroPullToRefreshCore()\n`;
                }
                switch (this.framework) {
                    case 'vue3':
                        args[0].loaderMeta.extraImportForWeb += `import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'\nimport * as list from '@tarojs/components'\n`;
                        args[0].loaderMeta.execBeforeCreateWebApp += `initVue3Components(component, list)\n`;
                        break;
                    default:
                        if (this.useHtmlComponents) {
                            args[0].loaderMeta.extraImportForWeb += `import '@tarojs/components-react/dist/index.css'\nimport { PullDownRefresh } from '@tarojs/components'\n`;
                            args[0].loaderMeta.execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`;
                        }
                }
                return args;
            });
            // Note: 本地调试 stencil 组件库时，如果启用 sourceMap 则需要相关配置
            chain.module
                .rule('map')
                .test(/\.map$/)
                .type('json');
        });
    }
    /**
     * 修改 Vite 配置
     */
    modifyViteConfig() {
        var _a, _b;
        const that = this;
        const { runnerUtils } = this.ctx;
        const { getViteH5CompilerContext } = runnerUtils;
        (_b = (_a = that.ctx).modifyViteConfig) === null || _b === void 0 ? void 0 : _b.call(_a, ({ viteConfig }) => {
            function aliasPlugin() {
                return {
                    name: 'taro:vite-h5-alias',
                    config: () => ({
                        resolve: {
                            alias: [
                                { find: /@tarojs\/components$/, replacement: that.componentLibrary },
                                { find: '@tarojs/components/lib', replacement: that.componentAdapter },
                                { find: /@tarojs\/router$/, replacement: that.routerLibrary },
                                { find: '@tarojs/taro', replacement: that.apiLibrary },
                            ],
                        },
                    }),
                };
            }
            function injectLoaderMeta() {
                return {
                    name: 'taro:vite-h5-loader-meta',
                    buildStart() {
                        return tslib.__awaiter(this, void 0, void 0, function* () {
                            const viteCompilerContext = yield getViteH5CompilerContext(this);
                            if (viteCompilerContext) {
                                viteCompilerContext.loaderMeta || (viteCompilerContext.loaderMeta = {
                                    extraImportForWeb: '',
                                    execBeforeCreateWebApp: '',
                                });
                                // Note: 旧版本适配器不会自动注册 Web Components 组件，需要加载 defineCustomElements 脚本自动注册使用的组件
                                if (that.useDeprecatedAdapterComponent) {
                                    viteCompilerContext.loaderMeta.extraImportForWeb += `import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'\n`;
                                    viteCompilerContext.loaderMeta.execBeforeCreateWebApp += `applyPolyfills().then(() => defineCustomElements(window))\n`;
                                }
                                if (!that.useHtmlComponents) {
                                    viteCompilerContext.loaderMeta.extraImportForWeb += `import { defineCustomElementTaroPullToRefreshCore } from '@tarojs/components/dist/components'\n`;
                                    viteCompilerContext.loaderMeta.execBeforeCreateWebApp += `defineCustomElementTaroPullToRefreshCore()\n`;
                                }
                                switch (that.framework) {
                                    case 'vue3':
                                        viteCompilerContext.loaderMeta.extraImportForWeb += `import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'\nimport * as list from '@tarojs/components'\n`;
                                        viteCompilerContext.loaderMeta.execBeforeCreateWebApp += `initVue3Components(component, list)\n`;
                                        break;
                                    default:
                                        if (that.useHtmlComponents) {
                                            viteCompilerContext.loaderMeta.extraImportForWeb += `import { PullDownRefresh } from '@tarojs/components'\n`;
                                            viteCompilerContext.loaderMeta.execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`;
                                        }
                                }
                            }
                        });
                    },
                };
            }
            function apiPlugin() {
                return {
                    name: 'taro:vite-h5-api',
                    enforce: 'post',
                    transform(code, id) {
                        return tslib.__awaiter(this, void 0, void 0, function* () {
                            const viteCompilerContext = yield getViteH5CompilerContext(this);
                            if (viteCompilerContext) {
                                const exts = Array.from(new Set(viteCompilerContext.frameworkExts.concat(helper.SCRIPT_EXT)));
                                let cleanId = id;
                                if (cleanId.startsWith('\u0000')) {
                                    cleanId = cleanId.slice(1);
                                }
                                cleanId = cleanId.split('?')[0].replace(/\\/g, '/'); // 👈 替换斜杠方向
                                const normalizedSourceDir = viteCompilerContext.sourceDir.replace(/\\/g, '/'); // 👈 替换斜杠方向
                                if (cleanId.startsWith(normalizedSourceDir) && exts.some((ext) => id.includes(ext))) {
                                    // @TODO 后续考虑使用 SWC 插件的方式实现
                                    const result = yield core.transformAsync(code, {
                                        filename: id,
                                        plugins: [
                                            [
                                                require('babel-plugin-transform-taroapi'),
                                                {
                                                    packageName: '@tarojs/taro',
                                                    definition: require(that.libraryDefinition)
                                                },
                                            ],
                                        ],
                                    });
                                    return {
                                        code: (result === null || result === void 0 ? void 0 : result.code) || code,
                                        map: (result === null || result === void 0 ? void 0 : result.map) || null,
                                    };
                                }
                            }
                        });
                    },
                };
            }
            viteConfig.plugins.push(aliasPlugin());
            viteConfig.plugins.push(injectLoaderMeta());
            viteConfig.plugins.push(apiPlugin());
        });
    }
}

var index = (ctx) => {
    ctx.registerPlatform({
        name: 'h5',
        useConfigName: 'h5',
        fn(_a) {
            return tslib.__awaiter(this, arguments, void 0, function* ({ config }) {
                const program = new H5(ctx, config);
                yield program.start();
            });
        }
    });
};

Object.defineProperty(exports, "resolveSync", {
    enumerable: true,
    get: function () { return helper.resolveSync; }
});
exports.H5 = H5;
exports.default = index;
//# sourceMappingURL=index.js.map
