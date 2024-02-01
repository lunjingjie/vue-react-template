import { paletteColor } from '@/mock/constant/index.js';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
// 获取点与点的距离
export const getDistance = (pointStart, pointEnd) => {
  let La1 = (pointStart.latitude * Math.PI) / 180.0;
  let La2 = (pointEnd.latitude * Math.PI) / 180.0;
  let La3 = La1 - La2;
  let Lb3 = (pointStart.longitude * Math.PI) / 180.0 - (pointEnd.longitude * Math.PI) / 180.0;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(La3 / 2), 2) +
          Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2),
      ),
    );
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  // console.log('计算结果', s, 'KM');
  return s * 1000;
};
// 比例值
export const setNh3nColor = (paramValue, param) => {
  console.log(paramValue, param);
  let color = '';
  if (paramValue >= param.min && paramValue <= param.max) {
    let percent = Math.round((paramValue / param.max) * 100) / 100;
    if (!paletteColor[percent]) {
      percent = Math.round((Math.round((Number(percent) + 0.01) * 100) / 100) * 100) / 100;
    }
    color = paletteColor[percent.toFixed(2)];
  } else if (paramValue < param.min) {
    color = '#000';
  } else if (paramValue > param.max) {
    color = '#880000';
  } else {
    color = '#062fdc';
  }
  return color;
};
// 拼接预测的数据到历史数据后面
export const getPreTime = (val) => {
  // 按四小时计算
  const dataTime = [
    dayjs().format('YYYY-MM-DD') + ' 00:00',
    dayjs().format('YYYY-MM-DD') + ' 04:00',
    dayjs().format('YYYY-MM-DD') + ' 08:00',
    dayjs().format('YYYY-MM-DD') + ' 12:00',
    dayjs().format('YYYY-MM-DD') + ' 16:00',
    dayjs().format('YYYY-MM-DD') + ' 20:00',
  ];
  const dataList = [];
  dataTime.forEach((res) => {
    if (dayjs(res).hour() > dayjs(val).hour()) {
      dataList.push(res);
    }
  });
  return dataList;
};
// 根据情况切割线段
// value:线条 // point :标识拆分的点 可能有多个
// export const cutSegment = (value, point) => {
//   console.log(value, point);
//   const list = [];
//   // if (point.length === 1) {
//     //根据点的情况判断需要距离几个点
//     // if (value.length < 10) {
//       // 按一个点按照两个点进行拆分
//       let slicePoint = 0;
//       value.forEach((res, index) => {
//         console.log(res);
//         console.log(point);
//         if (point[0].lat === res.lat && res.lng == point[0].lng) {
//           slicePoint = index;
//         }
//       });
//       console.log(slicePoint);
//       // 中间部分留三个点
//       if (slicePoint > 2) {
//         list.push(slicePoint.slice(0, slicePoint - 1));
//         list.push(slicePoint.slice(slicePoint - 1, slicePoint + 1));
//         list.push(slicePoint.slice(slicePoint, value.length));
//       }
//       console.log(list);
//     // } else {
//     //   // 按一个点按照两个点进行拆分
//     // }
//   // } else {
//   //   // 多个点进行拆分
//   // }
// };
