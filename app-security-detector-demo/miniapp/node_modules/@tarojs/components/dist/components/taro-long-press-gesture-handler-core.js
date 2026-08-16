import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const LongPressGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('LongPressGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-long-press-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-long-press-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-long-press-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LongPressGestureHandler);
      }
      break;
  } });
}

const TaroLongPressGestureHandlerCore = LongPressGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { LongPressGestureHandler as L, TaroLongPressGestureHandlerCore, defineCustomElement };
