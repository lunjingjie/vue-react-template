import axiosInstance from '@/plugins/axios';
export const sendCodeApi = (phone) => axiosInstance.get('auth/sendSMSCode' + `?phone=${phone}`);

export const checkUsersApi = (body) => axiosInstance.post('auth/checkCodeAndGetUsers', body);

export const updateDataApi = (body) => axiosInstance.post('auth/updatePassword', body);
