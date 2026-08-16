import type { Components, JSX } from "../types/components";

interface TaroScriptCore extends Components.TaroScriptCore, HTMLElement {}
export const TaroScriptCore: {
  prototype: TaroScriptCore;
  new (): TaroScriptCore;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
