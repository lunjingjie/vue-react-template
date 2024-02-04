import axiosInstance from '@/plugins/axios';

/**
 * 分页查询设备信息
 */
export const getSensorByPageApi = (params) =>
  axiosInstance.get('/sensor/getListByGatewayId', {
    params,
  });

/**
 * 新增或保存设备
 * @param {*} param 设备对象数组
 */
export const saveOrUpdateBatchSensorApi = (params) =>
  axiosInstance.post('/sensor/saveOrUpdateBatch', {
    sensors: params,
  });

/**
 * 删除设备
 * @param {*} sensorId
 */
export const deleteSensorApi = (sensorId) => axiosInstance.post(`/sensor/del?sensorId=${sensorId}`);
