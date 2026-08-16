import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class TapGestureHandler {
  componentDidLoad() {
    notSupport('TapGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-tap-gesture-handler-core"; }
}
