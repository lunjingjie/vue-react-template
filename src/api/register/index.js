import axiosInstance from '../../plugins/axios';

const Api = {
  REGISTER: 'register',
  GETUSERLIST: 'userList',
  AMENDPW: 'amendPw',
  CAPTCHA: 'captcha',
  CHECKNAME: 'checkName',
};
// 注册api
export const registerApi = (body) => axiosInstance.post(Api.REGISTER, body);
// 根据账户获取用户信息
export const userListApi = ({ name }) => {
  return axiosInstance.get(Api.GETUSERLIST, {
    params: {
      name,
    },
  });
};
// 更改密码api
export const amendPwApi = (body) => {
  return axiosInstance.post(Api.AMENDPW, body);
};
// 获取动态密码
export const getCaptcha = (body) => {
  return axiosInstance.post(Api.CAPTCHA, body);
};
// 检测账号是否注册
export const checkName = (body) => {
  return axiosInstance.post(Api.CHECKNAME, body);
};
