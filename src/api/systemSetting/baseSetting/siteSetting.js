import axiosInstance from '@/plugins/axios';
import { getSortParam } from '@/utils';

/**
 * 分页查询站点信息
 * @param {*} stationName 站点名称
 */
export const getSiteByPageApi = (params) =>
  axiosInstance.get(
    `/station/page?${getSortParam([
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
 * 根据id查询站点信息
 * @param {*} stationId 站点id
 * @returns
 */
export const getSiteByIdApi = (stationId) =>
  axiosInstance.get('/station/getById', {
    params: {
      stationId,
    },
  });

/**
 * 新增站点
 * @param {*} param 站点对象
 */
export const saveSiteApi = (params) => axiosInstance.post('/station/add', params);

/**
 * 修改站点
 * @param {*} param 站点对象
 */
export const updateSiteApi = (params) => axiosInstance.post('/station/edit', params);

/**
 * 删除站点
 * @param {*} stationId
 */
export const deleteSiteApi = (stationId) =>
  axiosInstance.post(`/station/del?stationId=${stationId}`);

// 获取站点扩展信息
export const getSiteExtraInfo = (stationId) =>
  axiosInstance.get('/stationProp/page', {
    params: {
      stationId,
      isCurr: 'Y',
    },
  });

// 修改站点扩展信息
export const editSiteExtraInfo = (params) => axiosInstance.post('/stationProp/edit', params);

// 新增站点扩展信息
export const saveSiteExtraInfo = (params) => axiosInstance.post('/stationProp/add', params);

// 批量保存站点和区域关系
export const saveSiteAreaRelation = (id, relIds) =>
  axiosInstance.post('/stationAreaRel/saveOrUpdate', {
    id,
    relIds,
  });
