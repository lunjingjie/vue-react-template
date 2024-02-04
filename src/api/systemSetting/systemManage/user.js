import axiosInstance from '@/plugins/axios';
import { fieldIsNull } from '@/utils/index.js';

const Api = {
  USERLIST: '/user/page',
  DETAILLIST: '/user/listDetailByPage',
  USERBYID: '/user/getById',
  ADDUSER: '/user/add',
  EDITUSER: '/user/edit',
  DELUSER: '/user/del',
  USERROLEREL: '/userRoleRel/saveOrUpdate',
};

export const userListApi = (current, size, userName) => {
  return axiosInstance.get(Api.USERLIST + `?current=${current}&size=${size}`, {
    params: {
      userName,
    },
  });
};

export const getUserListApi = (params) => {
  return axiosInstance.get(Api.USERLIST, {
    params,
  });
};

export const detailListApi = (current, size, userName, loginName) => {
  return axiosInstance.get(
    Api.DETAILLIST +
      `?current=${current}&size=${size}${fieldIsNull(userName, 'userName')}${fieldIsNull(
        loginName,
        'loginName',
      )}`,
  );
};
export const userByIdApi = (id) => {
  return axiosInstance.get(Api.USERBYID + `?id=${id}`);
};
export const addUserApi = (body) => {
  return axiosInstance.post(Api.ADDUSER, body);
};
export const editUserApi = (body) => {
  return axiosInstance.post(Api.EDITUSER, body);
};

export const delUserApi = (id) => {
  return axiosInstance.post(Api.DELUSER + `?id=${id}`);
};

export const userRoleApi = (body) => {
  return axiosInstance.post(Api.USERROLEREL, body);
};
