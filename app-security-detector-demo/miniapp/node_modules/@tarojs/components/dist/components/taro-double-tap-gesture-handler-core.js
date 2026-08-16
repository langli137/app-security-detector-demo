import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const DoubleTapGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('DoubleTapGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-double-tap-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-double-tap-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-double-tap-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DoubleTapGestureHandler);
      }
      break;
  } });
}

const TaroDoubleTapGestureHandlerCore = DoubleTapGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { DoubleTapGestureHandler as D, TaroDoubleTapGestureHandlerCore, defineCustomElement };
