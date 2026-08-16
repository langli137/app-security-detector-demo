import { PageConfig } from '../interface/utils.js';
import { PageInstance, Instance, PageProps } from './instance.js';

declare function injectPageInstance(inst: Instance<PageProps>, id: string): void;
declare function getPageInstance(id: string): Instance | undefined;
declare function removePageInstance(id: string): void;
declare function safeExecute(path: string, lifecycle: string, ...args: unknown[]): any;
declare function stringify(obj?: Record<string, unknown>): string;
declare function getPath(id: string, options?: Record<string, unknown>): string;
declare function getOnReadyEventKey(path: string): string;
declare function getOnShowEventKey(path: string): string;
declare function getOnHideEventKey(path: string): string;
declare function createPageConfig(component: any, pageName?: string, data?: Record<string, unknown>, pageConfig?: PageConfig): PageInstance;
declare function createComponentConfig(component: React.ComponentClass, componentName?: string, data?: Record<string, unknown>): any;
declare function createRecursiveComponentConfig(componentName?: string): any;

export { createComponentConfig, createPageConfig, createRecursiveComponentConfig, getOnHideEventKey, getOnReadyEventKey, getOnShowEventKey, getPageInstance, getPath, injectPageInstance, removePageInstance, safeExecute, stringify };
