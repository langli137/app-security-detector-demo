import { isHasExtractProp } from '@tarojs/runtime';
import { isString, isFunction, toCamelCase, hooks, warn } from '@tarojs/shared';
function genAttrMapFnFromDir(dir) {
  const fn = function (key, value) {
    const lowerKey = key.toLowerCase();
    if (lowerKey in dir) {
      const res = dir[lowerKey];
      if (isString(res)) {
        key = res;
      } else {
        key = res[0];
        value = res[1][value] || value;
      }
    }
    return [key, value];
  };
  return fn;
}
const inlineElements = new Set(["i", "abbr", "select", "acronym", "small", "bdi", "kbd", "strong", "big", "sub", "sup", "br", "mark", "meter", "template", "cite", "object", "time", "code", "output", "u", "data", "picture", "tt", "datalist", "var", "dfn", "del", "q", "em", "s", "embed", "samp", "b"]);
const blockElements = new Set(["body", "svg", "address", "fieldset", "li", "span", "article", "figcaption", "main", "aside", "figure", "nav", "blockquote", "footer", "ol", "details", "p", "dialog", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "dd", "header", "section", "div", "hgroup", "table", "dl", "hr", "ul", "dt", "view", "view-block"]);
const specialElements = new Map([['slot', 'slot'], ['form', 'form'], ['iframe', 'web-view'], ['img', 'image'], ['audio', 'audio'], ['video', 'video'], ['canvas', 'canvas'], ['a', {
  mapName(props) {
    if (props.as && isString(props.as)) return props.as.toLowerCase();
    return !props.href || /^javascript/.test(props.href) ? 'view' : 'navigator';
  },
  mapNameCondition: ['href'],
  mapAttr: genAttrMapFnFromDir({
    href: 'url',
    target: ['openType', {
      _blank: 'navigate',
      _self: 'redirect'
    }]
  })
}], ['input', {
  mapName(props) {
    if (props.type === 'checkbox') {
      return 'checkbox';
    } else if (props.type === 'radio') {
      return 'radio';
    }
    return 'input';
  },
  mapNameCondition: ['type'],
  mapAttr(key, value, props) {
    const htmlKey = key.toLowerCase();
    if (htmlKey === 'autofocus') {
      key = 'focus';
    } else if (htmlKey === 'readonly') {
      if (props.disabled === true) {
        value = true;
      }
      key = 'disabled';
    } else if (htmlKey === 'type') {
      if (value === 'password') {
        key = 'password';
        value = true;
      } else if (value === 'tel') {
        value = 'number';
      }
    } else if (htmlKey === 'maxlength') {
      key = 'maxlength';
    }
    return [key, value];
  }
}], ['label', {
  mapName: 'label',
  mapAttr: genAttrMapFnFromDir({
    htmlfor: 'for'
  })
}], ['textarea', {
  mapName: 'textarea',
  mapAttr: genAttrMapFnFromDir({
    autofocus: 'focus',
    readonly: 'disabled',
    maxlength: 'maxlength'
  })
}], ['progress', {
  mapName: 'progress',
  mapAttr(key, value, props) {
    if (key === 'value') {
      const max = props.max || 1;
      key = 'percent';
      value = Math.round(value / max * 100);
    }
    return [key, value];
  }
}], ['button', {
  mapName: 'button',
  mapAttr(key, value) {
    if (key === 'type' && (value === 'submit' || value === 'reset')) {
      key = 'formType';
    }
    return [key, value];
  }
}]]);
function isHtmlTags(nodeName) {
  if (inlineElements.has(nodeName) || blockElements.has(nodeName) || specialElements.has(nodeName)) {
    return true;
  }
  return false;
}
function getMappedType(nodeName, rawProps, node) {
  if (inlineElements.has(nodeName)) {
    return 'text';
  } else if (specialElements.has(nodeName)) {
    const mapping = specialElements.get(nodeName);
    if (isString(mapping)) {
      return mapping;
    }
    const {
      mapName
    } = mapping;
    return isFunction(mapName) ? mapName(rawProps) : mapName;
  } else {
    // fix #15326
    if (process.env.TARO_ENV === 'swan') return 'view';
    if (node) {
      const {
        props
      } = node;
      for (const prop in props) {
        const propInCamelCase = toCamelCase(prop);
        if (propInCamelCase === 'catchMove' && props[prop] !== false) {
          return 'catch-view';
        }
      }
    }
    if (!node) {
      return 'view';
    }
    if (node.isOnlyClickBinded() && !isHasExtractProp(node)) {
      return 'click-view';
    } else if (node.isAnyEventBinded()) {
      return 'view';
    } else if (isHasExtractProp(node)) {
      return 'static-view';
    } else {
      return 'pure-view';
    }
  }
}
function getAttrMapFn(nodeName) {
  const mapping = specialElements.get(nodeName);
  if (!isString(mapping)) {
    return mapping === null || mapping === void 0 ? void 0 : mapping.mapAttr;
  }
}
function getMapNameByCondition(nodeName, attr, props) {
  const mapping = specialElements.get(nodeName);
  if (!mapping || isString(mapping)) return;
  const {
    mapName,
    mapNameCondition
  } = mapping;
  if (!mapNameCondition) return;
  if (mapNameCondition.indexOf(attr) > -1 && !isString(mapName)) {
    return mapName(props);
  }
}
function mapNameByContion(nodeName, key, element, componentsAlias) {
  const mapName = getMapNameByCondition(nodeName, key, element.props);
  if (mapName) {
    const mapNameAlias = componentsAlias[mapName]._num;
    element.enqueueUpdate({
      path: `${element._path}.${"nn" /* Shortcuts.NodeName */}`,
      value: mapNameAlias
    });
  }
}
function ensureHtmlClass(tagName, className = '') {
  const classList = className.split(' ');
  const htmlClass = `h5-${tagName}`;
  if (classList.indexOf(htmlClass) === -1) {
    classList.unshift(htmlClass);
  }
  return classList.join(' ');
}
function ensureRect(props, style = '') {
  let cssText = style;
  const {
    width,
    height
  } = props;
  if (width) {
    cssText = `width: ${width};${cssText}`;
  }
  if (height) {
    cssText = `height: ${height};${cssText}`;
  }
  return cssText;
}
function defineMappedProp(obj, propName, mapName) {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    configurable: true,
    get() {
      return obj[mapName];
    },
    set(val) {
      obj[mapName] = val;
    }
  });
}
hooks.tap('modifyHydrateData', (data, node) => {
  const nodeName = data["nn" /* Shortcuts.NodeName */];
  if (!isHtmlTags(nodeName)) return;
  process.env.NODE_ENV !== 'production' && warn(data["nn" /* Shortcuts.NodeName */] === 'select', '请使用 Picker 组件代替 <select>');
  // map nodeName
  data["nn" /* Shortcuts.NodeName */] = getMappedType(nodeName, data, node);
  // map attr Key/Value
  const attrMapFn = getAttrMapFn(nodeName);
  if (attrMapFn) {
    for (const key in data) {
      const value = data[key];
      const [mapKey, mapValue] = attrMapFn(key, value, data);
      if (key !== mapKey) {
        delete data[key];
        data[mapKey] = mapValue;
      } else if (value !== mapValue) {
        data[key] = mapValue;
      }
    }
  }
  if (nodeName === 'br') {
    data["cn" /* Shortcuts.Childnodes */] = [{
      ["nn" /* Shortcuts.NodeName */]: '#text',
      v: '\n'
    }];
  }
  data["cl" /* Shortcuts.Class */] = ensureHtmlClass(nodeName, data["cl" /* Shortcuts.Class */]);
  data["st" /* Shortcuts.Style */] = ensureRect(data, data["st" /* Shortcuts.Style */]);
});
hooks.tap('modifySetAttrPayload', (element, key, payload, componentsAlias) => {
  const {
    nodeName,
    _path,
    props
  } = element;
  if (!isHtmlTags(nodeName)) return;
  // map nodeName
  mapNameByContion(nodeName, key, element, componentsAlias);
  const mapName = getMappedType(nodeName, props);
  const alias = componentsAlias[mapName];
  // map attr Key/Value
  const attrMapFn = getAttrMapFn(nodeName);
  if (attrMapFn) {
    const value = payload.value;
    const [mapKey, mapValue] = attrMapFn(key, value, props);
    payload.path = `${_path}.${alias[mapKey] || mapKey}`;
    payload.value = mapValue;
  } else if (alias[key] && alias[key] !== key) {
    payload.path = `${_path}.${toCamelCase(alias[key])}`;
  }
  if (key === "cl" /* Shortcuts.Class */) {
    payload.value = ensureHtmlClass(nodeName, payload.value);
  } else if (key === "st" /* Shortcuts.Style */ || key === 'width' || key === 'height') {
    payload.path = `${_path}.${"st" /* Shortcuts.Style */}`;
    payload.value = ensureRect(props, element.style.cssText);
  }
  if (blockElements.has(element.nodeName) && process.env.TARO_ENV !== 'swan') {
    const viewAlias = componentsAlias.view._num;
    const staticViewAlias = componentsAlias['static-view']._num;
    const catchViewAlias = componentsAlias['catch-view']._num;
    const clickViewAlias = componentsAlias['click-view']._num;
    const qualifiedNameInCamelCase = toCamelCase(key);
    const dataPath = `${_path}.${"nn" /* Shortcuts.NodeName */}`;
    if (qualifiedNameInCamelCase === 'catchMove') {
      // catchMove = true: catch-view
      // catchMove = false: view or click-view or static-view
      element.enqueueUpdate({
        path: dataPath,
        value: payload.value ? catchViewAlias : element.isOnlyClickBinded() && !isHasExtractProp(element) ? clickViewAlias : element.isAnyEventBinded() ? viewAlias : staticViewAlias
      });
    } else if (isHasExtractProp(element) && !element.isAnyEventBinded()) {
      // pure-view => static-view
      // static-view => static-view 因为没有办法分辨之前是不是 pure，所以就算之前是 static 也需要 setData
      element.enqueueUpdate({
        path: dataPath,
        value: staticViewAlias
      });
    }
  }
});
hooks.tap('modifyRmAttrPayload', (element, key, payload, componentsAlias) => {
  const {
    nodeName,
    _path,
    props
  } = element;
  if (!isHtmlTags(nodeName)) return;
  // map nodeName
  mapNameByContion(nodeName, key, element, componentsAlias);
  const mapName = getMappedType(nodeName, props);
  const alias = componentsAlias[mapName];
  // map attr Key/Value
  const attrMapFn = getAttrMapFn(nodeName);
  if (attrMapFn) {
    const value = payload[key];
    const [mapKey] = attrMapFn(key, value, props);
    payload.path = `${_path}.${alias[mapKey] || mapKey}`;
  } else if (alias[key] && alias[key] !== key) {
    payload.path = `${_path}.${toCamelCase(alias[key])}`;
  }
  if (key === "cl" /* Shortcuts.Class */) {
    payload.value = ensureHtmlClass(nodeName, payload.value);
  } else if (key === "st" /* Shortcuts.Style */ || key === 'width' || key === 'height') {
    payload.path = `${_path}.${"st" /* Shortcuts.Style */}`;
    payload.value = ensureRect(props, element.style.cssText);
  }
  if (blockElements.has(element.nodeName) && process.env.TARO_ENV !== 'swan') {
    const viewAlias = componentsAlias.view._num;
    const staticViewAlias = componentsAlias['static-view']._num;
    const pureViewAlias = componentsAlias['pure-view']._num;
    const clickViewAlias = componentsAlias['click-view']._num;
    const qualifiedNameInCamelCase = toCamelCase(key);
    const dataPath = `${_path}.${"nn" /* Shortcuts.NodeName */}`;
    if (qualifiedNameInCamelCase === 'catchMove') {
      // catch-view => view or click-view or static-view or pure-view
      element.enqueueUpdate({
        path: dataPath,
        value: element.isOnlyClickBinded() && !isHasExtractProp(element) ? clickViewAlias : element.isAnyEventBinded() ? viewAlias : isHasExtractProp(element) ? staticViewAlias : pureViewAlias
      });
    } else if (!isHasExtractProp(element)) {
      // static-view => pure-view
      // pure-view => pure-view 因为没有办法分辨之前是不是 pure，所以就算之前是 pure 也需要 setData
      element.enqueueUpdate({
        path: dataPath,
        value: pureViewAlias
      });
    }
  }
});
hooks.tap('onAddEvent', (type, _handler, _options, node) => {
  node = node;
  if (!isHtmlTags(node.nodeName)) return;
  if (type === 'click') {
    defineMappedProp(node.__handlers, type, 'tap');
  } else if (node.nodeName === 'input') {
    if (type === 'change') {
      if (node.props.type === 'checkbox' || node.props.type === 'radio') {
        defineMappedProp(node.__handlers, type, 'tap');
      } else {
        defineMappedProp(node.__handlers, type, 'input');
      }
    } else if (type === 'keypress') {
      defineMappedProp(node.__handlers, type, 'confirm');
    }
  }
});
hooks.tap('modifyTaroEvent', (event, element) => {
  const {
    nodeName,
    props
  } = element;
  if (nodeName === 'input' && event.type === 'tap') {
    if (props.type === 'checkbox') {
      props.checked = !props.checked;
    } else if (props.type === 'radio' && !props.checked) {
      props.checked = true;
    }
    if (event.mpEvent) {
      const {
        currentTarget,
        target
      } = event.mpEvent;
      currentTarget.checked = props.checked;
      if (target.id === currentTarget.id) {
        target.checked = props.checked;
      }
    }
  }
});
hooks.tap('modifyAddEventListener', (element, sideEffect, getComponentsAlias) => {
  // 如果是从没有事件绑定到有事件绑定，且是 block 元素，则转换为 view
  if (blockElements.has(element.nodeName) && sideEffect !== false && !element.isAnyEventBinded()) {
    const componentsAlias = getComponentsAlias();
    const alias = componentsAlias.view._num;
    element.enqueueUpdate({
      path: `${element._path}.${"nn" /* Shortcuts.NodeName */}`,
      value: alias
    });
  }
});
hooks.tap('modifyRemoveEventListener', (element, sideEffect, getComponentsAlias) => {
  // 如果已没有绑定事件，且是 block 元素，则转换为 static-view 或 pure-view
  if (process.env.TARO_ENV !== 'swan' && blockElements.has(element.nodeName) && sideEffect !== false && !element.isAnyEventBinded()) {
    const componentsAlias = getComponentsAlias();
    const value = isHasExtractProp(element) ? 'static-view' : 'pure-view';
    const valueAlias = componentsAlias[value]._num;
    element.enqueueUpdate({
      path: `${element._path}.${"nn" /* Shortcuts.NodeName */}`,
      value: valueAlias
    });
  }
});
//# sourceMappingURL=runtime.js.map