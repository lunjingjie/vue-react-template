import axiosInstance from '@/plugins/axios';
import { getSortParam } from '@/utils';

/**
 * 分页查询河涌信息
 * @param {*} basinName 河涌名称
 */
export const getRiverByPageApi = (params) =>
  axiosInstance.get(
    `/river/page?${getSortParam([
      {
        field: 'insertTime',
        asc: false,
      },
    ])}`,
    {
      params,
    },
  );

/**
 * 根据id查询河涌信息
 * @param {*} riverId 河涌id
 * @returns
 */
export const getRiverByIdApi = (riverId) =>
  axiosInstance.get('/river/getById', {
    params: {
      riverId,
    },
  });

/**
 * 新增河涌
 * @param {*} param 河涌对象
 */
export const saveRiverApi = (params) => axiosInstance.post('/river/add', params);

/**
 * 修改河涌
 * @param {*} param 河涌对象
 */
export const updateRiverApi = (params) => axiosInstance.post('/river/edit', params);

/**
 * 删除河涌
 * @param {*} riverId
 */
export const deleteRiverApi = (riverId) => axiosInstance.post(`/river/del?riverId=${riverId}`);
