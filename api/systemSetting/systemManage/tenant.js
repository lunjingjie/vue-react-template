import axiosInstance from '@/plugins/axios';
import { fieldIsNull, montageUrlParam } from '@/utils/index.js';

const Api = {
  TENANTLIS: '/tenant/page',
  ADDTENANT: '/tenant/add',
  EDITTENANT: '/tenant/edit',
  DELTENANT: '/tenant/del',
  TENANTMENU: '/tenantMenuRel/saveOrUpdate',
};

export const tenantListApi = (current, size, tenantName) => {
  return axiosInstance.get(
    Api.TENANTLIS + `?current=${current}&size=${size}${fieldIsNull(tenantName, 'tenantName')}`,
  );
};

export const addTenantApi = (body) => {
  return axiosInstance.post(Api.ADDTENANT, body);
};

export const editTenantApi = (body) => {
  return axiosInstance.post(Api.EDITTENANT, body);
};

export const delTenantApi = (id) => {
  return axiosInstance.post(Api.DELTENANT + `?id=${id}`);
};

export const tenantMenuApi = (body) => {
  return axiosInstance.post(Api.TENANTMENU, body);
};

// 保存租户对应的模板信息
export const saveModel = (params) => {
  return axiosInstance.post('/model/add', params);
};

// 修改租户对应的模板信息
export const editModel = (params) => {
  return axiosInstance.post('/model/edit', params);
};

// 删除租户对应的模板信息
export const deleteModel = (modelId) => {
  return axiosInstance.post(`/model/del?modelId=${modelId}`);
};

// 查询租户对应的模板信息
export const getAllModel = (params) => {
  return axiosInstance.get('/model/page', {
    params,
  });
};

// 通过id查询模板信息
export const getModelById = (modelId) => {
  return axiosInstance.get(`/model/getById?modelId=${modelId}`);
};

export const getTenantAdminApi = (val) => {
  return axiosInstance.get(`/user/getUserByRoleType${montageUrlParam(val)}`);
};

export const addTenantAdminApi = (body) => {
  return axiosInstance.post('/user/addTenantAdmin', body);
};

// 根据计算模板id获取模板信息，没有传参则返回系统默认计算模板
export const getTemplateModelByModelId = ({ templateId }) => {
  return axiosInstance.get('/waqCategoryConf/list', {
    params: {
      templateId,
    },
  });
};

// 批量保存计算模板
export const saveTemplateModelBatch = (waqCategoryConfs) => {
  return axiosInstance.post('/waqCategoryConf/saveOrUpdateBatch', {
    waqCategoryConfs,
  });
};

// 根据modelId查询告警类型
export const getAlarmTypeByModelId = (modelId) => {
  return axiosInstance.get(`/alarmType/getListByModelId?modelId=${modelId}`);
};

// 保存租户和管理员用户
export const saveTenantAndAdmin = (params) =>
  axiosInstance.post('/tenant/saveTenantAndUser', params);
