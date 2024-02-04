import { mapItemsConstant } from '@/constants';

// 特殊情况，有使用路由而没有配置菜单的情况
export const specialRoutes = [
  {
    routes: '/realTimeGis',
    name: mapItemsConstant.realTimeGis,
  },
  {
    routes: '/comprehensiveControl',
    name: mapItemsConstant.comprehensiveControl,
  },
  {
    routes: '/pollutionBlackSpots',
    name: mapItemsConstant.pollutionBlackSpots,
  },
  {
    routes: '/watershedWaterQuality',
    name: mapItemsConstant.watershedWaterQuality,
  },
];

/**
 * 判断是否是特殊路由（没有配置在菜单）
 */
export const judgeIsInSpecialRoutes = (path) => {
  let flag = false;
  specialRoutes.forEach((item) => {
    if (item.routes === path) {
      flag = true;
    }
  });
  return flag;
};

/**
 * 根据路由获取名称
 */
export const getNameByPath = (path) => {
  let name = '';
  specialRoutes.forEach((item) => {
    if (item.routes === path) {
      name = item.name;
    }
  });
  return name;
};
