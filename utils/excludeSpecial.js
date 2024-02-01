/* eslint-disable no-useless-escape */
export const excludeSpecial = (value) => {
  // 去掉转义字符

  let label = value.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
  return label;
};
// 解决小数相乘出现很多小数的问题
export const accMul = (arg1, arg2) => {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    /* empty */
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    /* empty */
  }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
};
