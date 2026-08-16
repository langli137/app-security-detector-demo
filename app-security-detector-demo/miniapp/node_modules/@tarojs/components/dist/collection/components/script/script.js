import { h, Host } from '@stencil/core';
import { notSupport } from '../../utils';
export class Script {
  componentDidLoad() {
    notSupport('Script', this);
  }
  render() {
    return (h(Host, null));
  }
  static get is() { return "taro-script-core"; }
}
