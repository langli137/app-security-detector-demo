import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const PanGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('PanGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-pan-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-pan-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-pan-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, PanGestureHandler);
      }
      break;
  } });
}

const TaroPanGestureHandlerCore = PanGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { PanGestureHandler as P, TaroPanGestureHandlerCore, defineCustomElement };
