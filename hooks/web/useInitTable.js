import { ref, watch, onMounted } from 'vue';
import dayjs from 'dayjs';
import { message as Message } from 'ant-design-vue';
import { isFunction } from '@/utils/is';

const formatFieldParam = (fieldValue) => {
  const params = {};
  Object.keys(fieldValue).forEach((key) => {
    if (fieldValue[key] !== '' && fieldValue[key] !== null) {
      if (key === 'beginTime') {
        params[key] = dayjs(fieldValue[key]).format('YYYY-MM-DD 00:00:00');
      } else if (key === 'endTime') {
        params[key] = dayjs(fieldValue[key]).format('YYYY-MM-DD 23:59:59');
      } else {
        params[key] = fieldValue[key];
      }
    }
  });
  return params;
};

/**
 * 初始化表格查询逻辑
 * @param {*} fieldValue 筛选条件
 * @param {*} searchApi 查询接口
 * @param {*} options {
      searchFunc // 查询回调函数
      onMountedBeforeCheckFunc // mounted查询接口前的回调函数
      onMountedAfterCheckFunc // mounted查询接口前的回调函数
    },
 */
export const useInitTable = (fieldValue, searchApi, options = {}) => {
  // 当前页码
  const current = ref(1);
  // 每页条数
  const size = ref(10);
  // 总条数
  const total = ref(0);
  // 表格数据
  const dataSource = ref([]);
  const offsetHeight = ref(null);

  watch([current, size], () => {
    getListByPage();
  });

  const getListByPage = async () => {
    const keys = Object.keys(fieldValue);
    if (keys.indexOf('beginTime') > -1 && keys.indexOf('endTime') > -1) {
      if (!fieldValue.beginTime && !fieldValue.endTime) {
        Message.warning('请选择开始、结束时间');
        return;
      }
      if (fieldValue.beginTime && !fieldValue.endTime) {
        Message.warning('请选择结束时间');
        return;
      }
      if (!fieldValue.beginTime && fieldValue.endTime) {
        Message.warning('请选择开始时间');
        return;
      }
      if (dayjs(fieldValue.endTime).unix() < dayjs(fieldValue.beginTime).unix()) {
        Message.warning('结束时间不能小于开始时间');
        return;
      }
    }
    const params = formatFieldParam(fieldValue);
    const { data } = await searchApi({
      current: current.value,
      size: size.value,
      ...params,
    });
    dataSource.value = data.data.records;
    total.value = data.data.total;
  };

  const search = () => {
    if (current.value !== 1) {
      current.value = 1;
    } else {
      getListByPage();
      isFunction(options.searchFunc) && options.searchFunc();
    }
  };

  onMounted(() => {
    offsetHeight.value = document.body.offsetHeight - 320;
    window.onresize = () => {
      return (() => {
        offsetHeight.value = document.body.offsetHeight - 320;
      })();
    };
    isFunction(options.onMountedBeforeCheckFunc) && options.onMountedBeforeCheckFunc();
    getListByPage();
    isFunction(options.onMountedAfterCheckFunc) && options.onMountedAfterCheckFunc();
  });

  return {
    current,
    size,
    total,
    dataSource,
    offsetHeight,
    search,
    getListByPage,
  };
};
