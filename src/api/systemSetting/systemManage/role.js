import axiosInstance from '@/plugins/axios';
import { fieldIsNull } from '@/utils/index.js';

const Api = {
  ROLELIST: '/role/page',
  ROLEBYID: '/role/getById',
  ADDROLE: '/role/add',
  EDITROLE: '/role/edit',
  DELROLE: '/role/del',
  ROLEMENU: '/roleMenuRel/saveOrUpdate',
  ROLETREE: '/role/tree',
};

export const roleListApi = (current, size, roleName) => {
  return axiosInstance.get(
    Api.ROLELIST + `?current=${current}&size=${size}${fieldIsNull(roleName, 'roleName')}`,
  );
};
export const roleByIdApi = (id) => {
  return axiosInstance.get(Api.ROLEBYID + `?id=${id}`);
};
export const addRoleApi = (body) => {
  return axiosInstance.post(Api.ADDROLE, body);
};

export const editRoleApi = (body) => {
  return axiosInstance.post(Api.EDITROLE, body);
};

export const delRoleApi = (id) => {
  return axiosInstance.post(Api.DELROLE + `?id=${id}`);
};

export const roleMenuApi = (body) => {
  return axiosInstance.post(Api.ROLEMENU, body);
};

export const roleeTreeApi = () => {
  return axiosInstance.get(Api.ROLETREE);
};
