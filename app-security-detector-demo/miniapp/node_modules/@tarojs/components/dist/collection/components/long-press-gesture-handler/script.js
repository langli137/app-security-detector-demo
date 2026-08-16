import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class LongPressGestureHandler {
  componentDidLoad() {
    notSupport('LongPressGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-long-press-gesture-handler-core"; }
}
