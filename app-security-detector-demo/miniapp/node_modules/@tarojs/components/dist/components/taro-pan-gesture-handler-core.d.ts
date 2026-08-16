import type { Components, JSX } from "../types/components";

interface TaroPanGestureHandlerCore extends Components.TaroPanGestureHandlerCore, HTMLElement {}
export const TaroPanGestureHandlerCore: {
  prototype: TaroPanGestureHandlerCore;
  new (): TaroPanGestureHandlerCore;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
