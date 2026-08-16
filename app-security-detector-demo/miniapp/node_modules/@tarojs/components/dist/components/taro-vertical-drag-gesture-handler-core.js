import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const VerticalDragGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('VerticalDragGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-vertical-drag-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-vertical-drag-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-vertical-drag-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, VerticalDragGestureHandler);
      }
      break;
  } });
}

const TaroVerticalDragGestureHandlerCore = VerticalDragGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { TaroVerticalDragGestureHandlerCore, VerticalDragGestureHandler as V, defineCustomElement };
