import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const ScaleGestureHandler = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('ScaleGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-scale-gesture-handler-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-scale-gesture-handler-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-scale-gesture-handler-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ScaleGestureHandler);
      }
      break;
  } });
}

const TaroScaleGestureHandlerCore = ScaleGestureHandler;
const defineCustomElement = defineCustomElement$1;

export { ScaleGestureHandler as S, TaroScaleGestureHandlerCore, defineCustomElement };
