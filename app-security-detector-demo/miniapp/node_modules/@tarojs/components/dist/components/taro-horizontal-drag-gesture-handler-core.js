import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const HorizontalDragGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('HorizontalDragGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-horizontal-drag-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-horizontal-drag-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-horizontal-drag-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, HorizontalDragGestureHandler);
      }
      break;
  } });
}

const TaroHorizontalDragGestureHandlerCore = HorizontalDragGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { HorizontalDragGestureHandler as H, TaroHorizontalDragGestureHandlerCore, defineCustomElement };
