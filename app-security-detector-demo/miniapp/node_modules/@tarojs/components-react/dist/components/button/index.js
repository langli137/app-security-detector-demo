import { __rest } from 'tslib';
import './style/index.scss.js';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import { omit, createForwardRefComponent } from '../../utils/index.js';
import { useRef, useState, useEffect, useCallback } from '../../utils/hooks.react.js';
import { jsxs, jsx } from 'react/jsx-runtime';

function Button(props) {
  const startTimer = useRef();
  const endTimer = useRef();
  const [state, setState] = useState({
    hover: false,
    touch: false
  });
  useEffect(() => {
    return () => {
      startTimer.current && clearTimeout(startTimer.current);
      endTimer.current && clearTimeout(endTimer.current);
    };
  }, []);
  const _onTouchStart = e => {
    setState(e => Object.assign(Object.assign({}, e), {
      touch: true
    }));
    if (props.hoverClass && props.hoverClass !== 'none' && !props.disabled) {
      startTimer.current = setTimeout(() => {
        if (state.touch) {
          setState(e => Object.assign(Object.assign({}, e), {
            hover: true
          }));
        }
      }, props.hoverStartTime || 20);
    }
    props.onTouchStart && props.onTouchStart(e);
  };
  const _onTouchEnd = e => {
    setState(e => Object.assign(Object.assign({}, e), {
      touch: false
    }));
    if (props.hoverClass && props.hoverClass !== 'none' && !props.disabled) {
      endTimer.current = setTimeout(() => {
        if (!state.touch) {
          setState(e => Object.assign(Object.assign({}, e), {
            hover: false
          }));
        }
      }, props.hoverStayTime || 70);
    }
    if (!props.disabled && props.formType) {
      const eventName = props.formType === 'submit' ? 'tarobuttonsubmit' : 'tarobuttonreset';
      e.currentTarget.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true
      }));
    }
    props.onTouchEnd && props.onTouchEnd(e);
  };
  const {
      forwardedRef,
      plain = false,
      children,
      disabled = false,
      className,
      style,
      onClick,
      hoverClass = 'button-hover',
      loading = false,
      type = 'default',
      size,
      formType
    } = props,
    restProps = __rest(props, ["forwardedRef", "plain", "children", "disabled", "className", "style", "onClick", "hoverClass", "loading", "type", "size", "formType"]);
  const handleClick = useCallback(e => {
    if (disabled) {
      // 按钮禁用时阻止事件冒泡并不触发点击回调
      e.stopPropagation();
      return;
    }
    // 按钮可用时触发点击回调
    onClick === null || onClick === void 0 ? void 0 : onClick(e);
  }, [disabled, onClick]);
  const cls = classNames(className, 'taro-button-core', {
    [`${hoverClass}`]: state.hover && !disabled,
    'taro-btn-disabled': disabled,
    'taro-btn-loading': loading,
    'taro-btn-plain': plain,
    'taro-btn-mini': size === 'mini',
    'taro-btn-default': type === 'default',
    'taro-btn-primary': type === 'primary',
    'taro-btn-warn': type === 'warn'
  });
  return /*#__PURE__*/jsxs(View, {
    ...omit(restProps, ['hoverClass', 'onTouchStart', 'onTouchEnd', 'type', 'loading', 'forwardedRef', 'size', 'plain', 'disabled', 'onClick', 'formType']),
    type: type,
    size: size,
    disabled: disabled,
    ref: forwardedRef,
    className: cls,
    style: style,
    onClick: handleClick,
    onTouchStart: _onTouchStart,
    onTouchEnd: _onTouchEnd,
    plain: plain.toString(),
    "form-type": formType,
    children: [!!loading && /*#__PURE__*/jsx(View, {
      className: "weui-loading"
    }), children]
  });
}
var index = createForwardRefComponent(Button);

export { index as default };
//# sourceMappingURL=index.js.map
