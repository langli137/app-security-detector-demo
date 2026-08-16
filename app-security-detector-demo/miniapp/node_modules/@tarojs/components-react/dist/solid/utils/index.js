import { createComponent, mergeProps } from 'solid-js/web';
import { forwardRef } from './hooks.solid.js';

function throttle(fn) {
  let threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  let scope = arguments.length > 2 ? arguments[2] : undefined;
  let lastTime = 0;
  let deferTimer;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    const context = scope || this;
    const now = Date.now();
    if (now - lastTime > threshold) {
      fn.apply(this, args);
      lastTime = now;
    } else {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        lastTime = now;
        fn.apply(context, args);
      }, threshold);
    }
  };
}
function debounce(fn) {
  let ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  let scope = arguments.length > 2 ? arguments[2] : undefined;
  let timer;
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    const context = scope || this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, ms);
  };
}
function omit(obj, fields) {
  const shallowCopy = Object.assign({}, obj);
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}
const createForwardRefComponent = ReactComponent => {
  const forwardRefComponent = (props, ref) => createComponent(ReactComponent, mergeProps(props, {
    forwardedRef: ref
  }));
  return forwardRef(forwardRefComponent);
};
// Picker 工具函数
function getTimeRange(begin, end) {
  const range = [];
  for (let i = begin; i <= end; i++) {
    range.push(`${i < 10 ? '0' : ''}${i}`);
  }
  return range;
}
const hoursRange = getTimeRange(0, 23);
const minutesRange = getTimeRange(0, 59);
/**
 * 校验传入的 value 是否合法
 */
function verifyValue(value, range) {
  if (!isNaN(+value) && value >= 0 && value < range.length) return true;
  return false;
}
/**
 * 检验传入的 time value 是否合法
 */
function verifyTime(value) {
  if (!/^\d{1,2}:\d{1,2}$/.test(value)) return false;
  const time = value.split(':').map(num => +num);
  if (time[0] < 0 || time[0] > 23) return false;
  if (time[1] < 0 || time[1] > 59) return false;
  return true;
}
/**
 * 比较时间
 * return t1 <= t2
 */
function compareTime(t1, t2) {
  const t1List = t1.split(':').map(i => +i);
  const t2List = t2.split(':').map(i => +i);
  if (t1List[0] < t2List[0]) return true;
  if (t1List[0] === t2List[0] && t1List[1] <= t2List[1]) return true;
  return false;
}
/**
 * 校验日期合法性，返回合法性和日期数组
 */
function verifyDate(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr.replace(/-/g, '/'));
  return isNaN(date.getMonth()) ? false : date;
}
/**
 * 获取当月最大天数
 */
function getMaxDay(year, month) {
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  if (month === 2) {
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) return 29;else return 28;
  }
  return 31;
}
/**
 * 获取时间数组
 */
function getDateRange(start, end) {
  const range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
}
/**
 * 获取年份区间数组
 */
function getYearRange(start, end) {
  return getDateRange(start, end);
}
/**
 * 获取月份区间数组
 */
function getMonthRange(start, end, year) {
  let rangeStart = 1;
  let rangeEnd = 12;
  // 当前年份等于开始年份，由开始对应的月份约束开始值
  if (start.getFullYear() === year) {
    rangeStart = start.getMonth() + 1;
  }
  // 当前年份等于结束年份，由结束对应的月份约束结束值
  if (end.getFullYear() === year) {
    rangeEnd = end.getMonth() + 1;
  }
  return getDateRange(rangeStart, rangeEnd);
}
/**
 * 获取日期区间数组
 */
function getDayRange(start, end, year, month) {
  let rangeStart = 1;
  let rangeEnd = getMaxDay(year, month);
  if (start.getFullYear() === year && start.getMonth() + 1 === month) {
    rangeStart = start.getDate();
  }
  if (end.getFullYear() === year && end.getMonth() + 1 === month) {
    rangeEnd = end.getDate();
  }
  return getDateRange(rangeStart, rangeEnd);
}

export { compareTime, createForwardRefComponent, debounce, getDayRange, getMonthRange, getYearRange, hoursRange, minutesRange, omit, throttle, verifyDate, verifyTime, verifyValue };
//# sourceMappingURL=index.js.map
