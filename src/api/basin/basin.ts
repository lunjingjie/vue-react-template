import { ListParams } from '../../types/list/list';
import axiosInstance from '../config';

export const getBasinListApi = (params: ListParams) =>
  axiosInstance.get('/basin/page', {
    params,
  });
