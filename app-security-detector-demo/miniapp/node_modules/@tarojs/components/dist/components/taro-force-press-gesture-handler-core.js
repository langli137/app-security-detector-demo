import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const ForcePressGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('ForcePressGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-force-press-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-force-press-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-force-press-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ForcePressGestureHandler);
      }
      break;
  } });
}

const TaroForcePressGestureHandlerCore = ForcePressGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { ForcePressGestureHandler as F, TaroForcePressGestureHandlerCore, defineCustomElement };
