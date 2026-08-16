import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { c as classnames } from './index2.js';

const indexCss = "img[src=\"\"]{opacity:0}taro-image-core{width:320px;height:240px;font-size:0;display:inline-block;position:relative;overflow:hidden}.taro-img.taro-img__widthfix{height:100%}.taro-img__mode-scaletofill{width:100%;height:100%}.taro-img__mode-aspectfit{max-width:100%;max-height:100%;position:absolute;top:50%;transform:translateY(-50%)}.taro-img__mode-aspectfill{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.taro-img__mode-aspectfill--width{min-width:100%;height:100%}.taro-img__mode-aspectfill--height{width:100%;min-height:100%}.taro-img__mode-widthfix{width:100%}.taro-img__mode-heightfix{height:100%}.taro-img__mode-top{position:absolute;left:50%;transform:translate(-50%)}.taro-img__mode-bottom{position:absolute;bottom:0;left:50%;transform:translate(-50%)}.taro-img__mode-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.taro-img__mode-left{position:absolute;top:50%;transform:translateY(-50%)}.taro-img__mode-right{position:absolute;top:50%;right:0;transform:translateY(-50%)}.taro-img__mode-topright{position:absolute;right:0}.taro-img__mode-bottomleft{position:absolute;bottom:0}.taro-img__mode-bottomright{position:absolute;bottom:0;right:0}";

const Image = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.onLoad = createEvent(this, "load", 7);
    this.onError = createEvent(this, "error", 7);
    this.src = undefined;
    this.mode = 'scaleToFill';
    this.lazyLoad = false;
    this.nativeProps = {};
    this.aspectFillMode = 'width';
    this.didLoad = false;
  }
  componentDidLoad() {
    if (!this.lazyLoad)
      return;
    const lazyImg = new IntersectionObserver(entries => {
      // 异步 api 关系
      if (entries[entries.length - 1].isIntersecting) {
        lazyImg.unobserve(this.imgRef);
        this.didLoad = true;
      }
    }, {
      rootMargin: '300px 0px'
    });
    lazyImg.observe(this.imgRef);
  }
  imageOnLoad() {
    const { width, height, naturalWidth, naturalHeight } = this.imgRef;
    this.onLoad.emit({
      width,
      height
    });
    this.aspectFillMode = naturalWidth > naturalHeight ? 'width' : 'height';
  }
  imageOnError(e) {
    this.onError.emit(e);
  }
  render() {
    const { src, lazyLoad = false, aspectFillMode = 'width', imageOnLoad, imageOnError, nativeProps, didLoad } = this;
    // mode="" 按默认值处理
    const mode = this.mode || 'scaleToFill';
    const cls = classnames({
      'taro-img__widthfix': mode === 'widthFix'
    });
    const imgCls = classnames(`taro-img__mode-${mode.toLowerCase().replace(/\s/g, '')}`, {
      [`taro-img__mode-aspectfill--${aspectFillMode}`]: mode === 'aspectFill'
    });
    return (h(Host, { class: cls }, src ? (h("img", Object.assign({ ref: (img) => (this.imgRef = img), class: imgCls, src: lazyLoad && !didLoad ? undefined : src, onLoad: imageOnLoad.bind(this), onError: imageOnError.bind(this) }, nativeProps))) : ''));
  }
  static get style() { return indexCss; }
}, [0, "taro-image-core", {
    "src": [1],
    "mode": [1],
    "lazyLoad": [4, "lazy-load"],
    "nativeProps": [16],
    "aspectFillMode": [32],
    "didLoad": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["taro-image-core"];
  components.forEach(tagName => { switch (tagName) {
    case "taro-image-core":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Image);
      }
      break;
  } });
}

const TaroImageCore = Image;
const defineCustomElement = defineCustomElement$1;

export { Image as I, TaroImageCore, defineCustomElement };
