import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class ForcePressGestureHandler {
  componentDidLoad() {
    notSupport('ForcePressGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-force-press-gesture-handler-core"; }
}
