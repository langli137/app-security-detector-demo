import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class HorizontalDragGestureHandler {
  componentDidLoad() {
    notSupport('HorizontalDragGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-horizontal-drag-gesture-handler-core"; }
}
