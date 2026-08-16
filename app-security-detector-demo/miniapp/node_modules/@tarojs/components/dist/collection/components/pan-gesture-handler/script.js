import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class PanGestureHandler {
  componentDidLoad() {
    notSupport('PanGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-pan-gesture-handler-core"; }
}
