import axiosInstance from '../../plugins/axios';

const Api = {
  LOGIN: '/auth/token',
};

export const loginApi = ({ name, password }) =>
  axiosInstance.post(Api.LOGIN, {
    loginName: name,
    password,
  });

export const templateApi = () => axiosInstance.get('mockTemplate');

// 获取登录菜单树
export const getLoginMenuTreeApi = () => axiosInstance.get('/menu/loginTree');

// 获取登录用户的区域信息
export const getLoginUserAreaApi = () => axiosInstance.get('/area/getUserParentArea');

// 获取登录用户的模板信息
export const getLoginUserTemplateApi = () => axiosInstance.get('/model/getModelByToken');
