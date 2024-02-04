import axiosInstance from '@/plugins/axios';
import { fieldIsNull } from '@/utils/index.js';

const Api = {
  MENU_PAGE: '/menu/page',
  MENU_TREE: '/menu/tree',
  MENU_TREE_ID: '/menu/getById',
  MENU_SAVE: '/menu/add',
  MENU_EDIT: '/menu/edit',
  MENU_DELETE: '/menu/del',
  MENU_USER: '/menu/getTreeByUser',
};

export const menuListApi = (current, size, params) => {
  return axiosInstance.get(Api.MENU_PAGE + `?current=${current}&size=${size}`, {
    params,
  });
};
// export const menuTreeApi = (tenantId,roleId,  name) => {
//   return axiosInstance.get(`${Api.MENU_TREE}`, {
//     params: {
//       tenantId,
//       roleId,
//       name,
//     },
//   });
// };
// export const menuTreeApi = (tenantId) => {
//   return axiosInstance.get(Api.MENU_TREE + `?tenantId=${tenantId}`);
// };
// export const menuTreeApi = (roleId, tenantId, name) => {
//   return axiosInstance.get(
//     `${Api.MENU_TREE}${fieldIsNull(roleId, 'roleId')}${fieldIsNull(
//       tenantId,
//       'tenantId',
//     )}${fieldIsNull(name, 'name')}`,
//   );
// };
export const menuTreeApi = (roleId, tenantId) => {
  return axiosInstance.get(
    Api.MENU_TREE + `?${fieldIsNull(roleId, 'roleId')}${fieldIsNull(tenantId, 'tenantId')}`,
  );
};

export const menuIdApi = (id) => {
  return axiosInstance.get(Api.MENU_TREE_ID + `?id=${id}`);
};

export const menuSaveApi = (body) => {
  return axiosInstance.post(Api.MENU_SAVE, body);
};

export const menuEditApi = (body) => {
  return axiosInstance.post(Api.MENU_EDIT, body);
};
export const menuDeleteApi = (id) => {
  return axiosInstance.post(Api.MENU_DELETE + `?id=${id}`);
};
export const menuUserApi = () => {
  return axiosInstance.get(Api.MENU_USER);
};
