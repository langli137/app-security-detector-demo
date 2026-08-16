import type { Components, JSX } from "../types/components";

interface TaroTapGestureHandlerCore extends Components.TaroTapGestureHandlerCore, HTMLElement {}
export const TaroTapGestureHandlerCore: {
  prototype: TaroTapGestureHandlerCore;
  new (): TaroTapGestureHandlerCore;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
