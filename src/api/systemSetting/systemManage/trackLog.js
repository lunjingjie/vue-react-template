import axiosInstance from '@/plugins/axios';
import { getSortParam } from '@/utils';

export const getTrackLogListApi = (params) =>
  axiosInstance.get(
    `/functionHotSpots/page?${getSortParam([
      {
        field: 'insertTime',
        asc: false,
      },
    ])}`,
    { params },
  );

export const newTrackLogApi = (params) => axiosInstance.post('/functionHotSpots/add', params);

export const getChartDataApi = (params) =>
  axiosInstance.get('/functionHotSpots/getCountData', {
    params,
  });

// 操作日志
export const getOperationLogListApi = (params) =>
  axiosInstance.get(
    `/sysOperateLog/page?${getSortParam([
      {
        field: 'insertTime',
        asc: false,
      },
    ])}`,
    { params },
  );

// 操作日志-操作类型集合
export const getOperationTypeListApi = () => axiosInstance.get('sysOperateLog/getMethodType');
