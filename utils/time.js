import dayjs from 'dayjs';

// 转化秒数为分钟、小时
export const formatSecond = (second) => {
  // 大于60秒转为分钟、大于3600秒转为小时
  if (second > 60 && second < 3600) {
    const min = Math.floor(second / 60);
    const sec = second % 60;
    return `${min}分钟${sec > 0 ? sec + '秒' : ''}`;
  } else if (second >= 3600) {
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second % 3600) / 60);
    const sec = second % 60;
    return `${hour}小时${min}分钟${sec}秒`;
  } else {
    return `${second}秒`;
  }
};

/**
 * 根据开始时间与结束时间计算的diff，判断用小时/日/月接口
 * @param {*} beginTime 开始时间
 * @param {*} endTime 结束时间
 * @param {*} apis 小时、日、月接口
 * return 返回对应的数组
 */
export const getDataListByDiffentTimeApi = async (beginTime, endTime, apis = {}) => {
  const diff = dayjs(endTime).diff(dayjs(beginTime), 'day');
  const diffMonth = dayjs(endTime).diff(dayjs(beginTime), 'month');
  // 规则：≤31用小时接口，＞31用日接口，大于三个月用月接口
  let res = null;
  if (diff <= 31) {
    res = await apis.hourApi();
  } else if (diff > 31 && diffMonth <= 3) {
    res = await apis.dayApi();
  } else if (diffMonth > 3) {
    res = await apis.monthApi();
  }
  if (res.data && res.data.code === 200) {
    return res.data.data;
  } else {
    return [];
  }
};

/**
 * 有查找范围时间约束判断，返回type（hour、day、month），用于控制x轴生成传参，只在小时的情况做处理
 */
export const getTimeTypeByRange = (timeType, beginTime, endTime) => {
  if (timeType !== 'hour') {
    return timeType;
  }

  const diff = dayjs(endTime).diff(dayjs(beginTime), 'day');
  const diffMonth = dayjs(endTime).diff(dayjs(beginTime), 'month');
  let type = 'hour';

  if (diff <= 31) {
    type = 'hour';
  } else if (diff > 31 && diffMonth <= 3) {
    type = 'day';
  } else if (diffMonth > 3) {
    type = 'month';
  }
  return type;
};
