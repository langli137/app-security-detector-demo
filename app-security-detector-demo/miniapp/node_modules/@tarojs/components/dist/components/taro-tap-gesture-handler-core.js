import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const TapGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('TapGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-tap-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-tap-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-tap-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, TapGestureHandler);
      }
      break;
  } });
}

const TaroTapGestureHandlerCore = TapGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { TapGestureHandler as T, TaroTapGestureHandlerCore, defineCustomElement };
