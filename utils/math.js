import { isNumber } from './is';

// 四舍五入保留两位小数
export const toMathFixed = (num, len) => {
  if (!isNumber(num)) {
    throw new Error('toFixed: num is not a number');
  }
  const multiNum = Math.pow(10, len);
  return (Math.round(num * multiNum) / multiNum).toFixed(len);
};

// 取绝对值
export const toAbs = (num) => {
  if (!isNumber(num)) {
    throw new Error('toAbs: num is not a number');
  }
  return Math.abs(num);
};
