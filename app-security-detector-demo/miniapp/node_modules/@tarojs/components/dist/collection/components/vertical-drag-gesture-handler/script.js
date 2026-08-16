import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class VerticalDragGestureHandler {
  componentDidLoad() {
    notSupport('VerticalDragGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-vertical-drag-gesture-handler-core"; }
}
