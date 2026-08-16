import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class DoubleTapGestureHandler {
  componentDidLoad() {
    notSupport('DoubleTapGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-double-tap-gesture-handler-core"; }
}
