import axiosInstance from '@/plugins/axios';

/**
 * 分页查询网关信息
 * @param {*} gatewayName 网关名称
 */
export const getGatewayByPageApi = (params) =>
  axiosInstance.get('/gateway/page', {
    params,
  });

/**
 * 新增网关
 * @param {*} param 网关对象
 */
export const saveGatewayApi = (params) => axiosInstance.post('/gateway/add', params);

/**
 * 修改网关
 * @param {*} param 网关对象
 */
export const updateGatewayApi = (params) => axiosInstance.post('/gateway/edit', params);
