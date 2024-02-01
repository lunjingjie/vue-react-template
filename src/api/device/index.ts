import axiosInstance from '../config';

export const getDeviceListApi = () =>
  axiosInstance.get('/devices/devices_status');
