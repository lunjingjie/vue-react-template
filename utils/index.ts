import { eventConstant } from '@/constants';
import { isString } from '@/utils/is';
import dayjs from 'dayjs';
import { menuList } from '@/stores/aside';
import { router } from '@/plugins/router';

/**
 * 根据nodeId获取对应节点下的数据
 * @param {object} treeData 树形数据
 * @param {string} id 节点id
 * @returns 节点
 */
export const getTreeNodeById = (treeData, id, key = 'id') => {
  if (!isNotEmptyObject(treeData)) {
    return {};
  }
  return loopChildren(treeData, id, key);
};

const loopChildren = (treeData, id, key) => {
  let result = null;
  if (treeData[key] === id) {
    result = treeData;
    return result;
  }
  if (treeData.children && treeData.children.length) {
    treeData.children.forEach((item) => {
      result = loopChildren(item, id, key);
    });
  }
  return result;
};

/**
 * 判断是否是空对象
 * @param {object} obj 对象
 * @returns 布尔值
 */
export const isNotEmptyObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]' && Reflect.ownKeys(obj).length;
};

/**
 * 判断是否空对象时，处理返回值
 * @param {object} object 对象
 * @param {string} returnKey key
 * @param {string} errorVal 错误替代值
 * @returns 处理值
 */
export const isNull2ReturnValue = (object, returnKey, errorVal) => {
  return isNotEmptyObject(object) ? object[returnKey] : errorVal;
};

/**
 * 合并行
 * @param {String} key 列value
 * @param {Array} tableData 数组
 * @returns 合并后数组
 */
export const combineRow = (key, tableData) => {
  for (let i = 0; i < tableData.length; i += 1) {
    const item = tableData[i];
    let count = 1;
    for (let j = i + 1; j < tableData.length; j += 1) {
      // 如果是同一个值，往后递增
      if (item[key] === tableData[j][key]) {
        count++;
        // 往后相同的值都设为空单元格
        tableData[j][`${key}RowSpan`] = 0;
        // 只有同值第一个才设置合并的单元格数
        item[`${key}RowSpan`] = count;
        // 所有都是为同一个值的情况
        // 如果到了尾部，则循环结束
        if (j === tableData.length - 1) {
          return;
        }
      } else {
        // 指针跳转到下一个，从下一排开始
        i = j - 1;
        count = 1;
        tableData[j][`${key}RowSpan`] = 1;
        break;
      }
    }
  }
  return tableData;
};

/**
 * 根据对象的key进行排序
 * @param {*} object 对象
 * @returns 排序后的新对象
 */
export const objKeySort = (object) => {
  const newkey = Object.keys(object).sort();
  const newObj = {};
  for (let i = 0; i < newkey.length; i += 1) {
    newObj[newkey[i]] = object[newkey[i]];
  }
  return newObj;
};

/**
 * 对象深拷贝
 * @param {*} obj 原始对象
 * @param {*} hash 存放对象集合
 * @returns 拷贝对象
 */
export const deepClone = (obj, hash = new WeakMap()) => {
  if (obj === null) {
    return null;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  const resObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, resObj);
  Reflect.ownKeys(obj).forEach((key) => {
    resObj[key] = deepClone(obj[key], hash);
  });
  return resObj;
};

// 本地下载文件
export const getDownloadFile = (res, fileName) => {
  if (!res) {
    return;
  }
  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(res, fileName);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  } else {
    const url = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

// 密码校验
export const passwordVerify = (res) => {
  const regPassword =
    /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,64}$/;
  return regPassword.test(res);
};

/**
 * 通过key去重数组
 * @param {*} arr 原数组
 * @param {*} key 字段
 * @returns 去重后数组
 */
export const dropRepetitionByKey = (arr, key) => {
  const target = [];
  let tempArr = [];
  // 将字符串转成数组
  tempArr = Array.from(arr);
  tempArr.forEach((item) => {
    // 如果target数组中没有该value，则将其添加到数组中
    if (!target.filter((tar) => tar[key] === item[key]).length > 0) {
      target.push(item);
    }
  });
  return target;
};

// 数组去重
export const dropRepetition = (arr) => {
  const target = [];
  let tempArr = [];
  // 将字符串转成数组
  tempArr = Array.from(arr);
  tempArr.forEach((item) => {
    // 如果target数组中没有该value，则将其添加到数组中
    if (!target.includes(item)) {
      target.push(item);
    }
  });
  return target;
};

export const colorMap = {
  一般: '#1E88E5', // 蓝
  较大: '#FFEE58', // 黄
  重大: '#EF5350', // 红
  数据不完整: '#1E88E5', // 蓝
  M1: '#43A047', // 绿
  M2: '#1E88E5',
  M3: '#FFEE58',
  M4: '#EF5350',
  Q0: '#43A047',
  Q1: '#1E88E5',
  Q2: '#FFEE58',
  Q3: '#EF5350',
  E1: '#FFEE58',
  E2: '#1E88E5',
  E3: '#43A047',
};

export const getRawRoute = (route) => {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined,
  };
};

/**
 * 通过DFS算法查找树状结构数组中某个节点的路径
 * @param {*} array 树状结构数组
 * @param {*} param 参数字段名
 * @param {*} value 参数值
 * @param {*} exportParam 导出字段名
 * @param {*} oputObj 是否导出整个对象
 * @returns 路径数组
 */
export const find = (array, param, value, exportParam, oputObj = false) => {
  let stack = [];
  let going = true;
  let walker = (array, title) => {
    array.forEach((item) => {
      if (!going) return;
      if (oputObj) {
        stack.push(item);
      } else {
        stack.push(item[exportParam]);
      }
      if (item[param] === title) {
        going = false;
      } else if (title.indexOf(item[param]) !== -1 && item[param] !== '' && !item['children']) {
        stack = [item];
        going = false;
      } else if (item['children']) {
        walker(item['children'], title);
      } else {
        stack.pop();
      }
    });
    if (going) stack.pop();
  };
  walker(array, value);
  return stack;
};

/**
 * 接口字段判空
 */
export const fieldIsNull = (val, text) => {
  if (val == null || val === '') return '';
  return `&${text}=${val}`;
};

export const getValueByOptions = (value, options) => {
  const option = options.find((item) => item.value === value);
  return option ? option.label : '--';
};

/**
 * 获取树中的某一项
 * @param {*} tree 树状数据
 * @param {*} value 数值
 */
export const getValueByTree = (tree, key, value) => {
  let item = null;
  const find = (tree, value) => {
    tree.forEach((node) => {
      if (node.id === value) {
        item = node;
      } else if (node.children && node.children.length) {
        find(node.children, value);
      }
    });
  };
  find(tree, value);
  if (!item) {
    return;
  }
  return item[key];
};

/**
 * 返回树状特定数据
 * @param {*} tree
 * @param {*} findKey 需要对比的key
 * @param {*} value 需要对比的key对应的value值
 * @param {*} resKey 返回的key
 * @returns resKey对应的value
 */
export const getKeyValueByTree = (tree, findKey, value, resKey) => {
  let item = null;
  const find = (tree, value) => {
    tree.forEach((node) => {
      if (node[findKey] === value) {
        item = node;
      } else if (node.children && node.children.length) {
        find(node.children, value);
      }
    });
  };
  find(tree, value);
  if (!item) {
    return;
  }
  return item[resKey];
};

export const montageUrlParam = (object) => {
  let url = '';
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      if (object[key] != null && object[key] != '') {
        url += `&${key}=${object[key]}`;
      }
    }
  }
  if (url != '') {
    url = `?${url.slice(1)}`;
  }
  return url;
};

// 获取事件状态对应的标签颜色
export const getStatusColor = (status) => {
  return eventConstant[status];
};

// 字符串转数字
export const strToNum = (str) => {
  return isString(str) ? Number(str) : str;
};

/**
 * 格式化时间
 * @param {string} type hour/day/month
 * @returns 时间字符串格式
 */
export const getFormat = (type) => {
  switch (type) {
    case 'hour':
      return 'YYYY-MM-DD HH:00';
    case 'day':
      return 'YYYY-MM-DD';
    case 'month':
      return 'YYYY-MM';
    default:
      return 'YYYY-MM-DD HH:00';
  }
};

export const formatDataTime = (time, type) => {
  return time ? dayjs(time).format(getFormat(type)) : '--';
};

/**
 * 根据时间类型封装X轴数据
 * @param {string} type hour/day/month
 * @param {string} beginTime 开始时间
 * @param {string} lastTime 结束时间
 * @returns X轴数据
 */
export const getTimeXAxisData = (type, beginTime, lastTime, timeInterval = 4) => {
  const startTime = dayjs(beginTime);
  const endTime = dayjs(lastTime);
  const getInterval = () => {
    switch (type) {
      case 'hour':
        return timeInterval;
      case 'day':
        return 1;
      case 'month':
        return 1;
      default:
        return timeInterval;
    }
  };
  const getTarget = () => {
    const xAxisData = [];
    const diff = endTime.diff(startTime, type);
    for (let i = 0; i <= diff; i += getInterval()) {
      xAxisData.push(startTime.add(i, type).format(getFormat(type)));
    }
    return xAxisData;
  };
  return getTarget();
};

// 封装排序参数
export const getSortParam = (sort) => {
  let urlParam = [];

  sort.forEach((item) => {
    // 驼峰转下划线分割
    const field = item.field.replace(/([A-Z])/g, '_$1').toLowerCase();
    urlParam.push(
      `orders${encodeURIComponent('[0]')}.column=${field}&orders${encodeURIComponent('[0]')}.asc=${
        item.asc
      }`,
    );
  });

  return urlParam.join('&');
};

/**
 * 排序
 * @param {*} dataList 数组
 * @param {*} key 键值
 * @param {*} type asc/desc
 * @returns array
 */
export const arraySort = (dataList, key, type) => {
  if (!Array.isArray(dataList)) {
    return;
  }

  const targetArr = dataList.filter((item) => item[key] !== null);
  const nullArr = dataList.filter((item) => item[key] === null);

  const targetSortArr = targetArr.sort((a, b) => {
    return type === 'asc' ? a[key] - b[key] : b[key] - a[key];
  });

  return [...targetSortArr, ...nullArr];
};

export const createNewArr = (data, key) => {
  return data
    .reduce((result, item) => {
      if (result.indexOf(item[key]) < 0) {
        result.push(item[key]);
      }
      return result;
    }, [])
    .reduce((result, value) => {
      const children = data.filter((item) => item[key] === value);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0,
        })),
      );

      return result;
    }, []);
};

export function generateUUID() {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

let cacheMenuList = [];

export const hasPermissionField = () => {
  if (!cacheMenuList.length) {
    const menuStore = menuList();
    cacheMenuList = menuStore.asideMenu;
  }

  const currentRoutePath = router.currentRoute.value.path;
  const routeChidren = getKeyValueByTree(cacheMenuList, 'url', currentRoutePath, 'children');
  return (
    routeChidren
      .filter((item) => item.permission && item.permission !== '')
      .map((item) => item.permission).length > 0
  );
};
