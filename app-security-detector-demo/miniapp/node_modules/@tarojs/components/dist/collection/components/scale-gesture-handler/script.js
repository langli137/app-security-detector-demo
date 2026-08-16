import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class ScaleGestureHandler {
  componentDidLoad() {
    notSupport('ScaleGestureHandler', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-scale-gesture-handler-core"; }
}
