import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { n as notSupport } from './helper.js';

const Script = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    notSupport('Script', this);
  }
  render() {
    return (h(Host, null));
  }
}, [0, "taro-script-core"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-script-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-script-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Script);
      }
      break;
  } });
}

const TaroScriptCore = Script;
const defineCustomElement = defineCustomElement$1;

export { Script as S, TaroScriptCore, defineCustomElement };
