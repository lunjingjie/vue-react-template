import axiosInstance from '@/plugins/axios';
import { fieldIsNull } from '@/utils/index.js';

export const getDictListData = (current, size, dictType, dictLabel) => {
  return axiosInstance.get(
    `/dict/page?current=${current}&size=${size}${fieldIsNull(dictType, 'dictType')}${fieldIsNull(
      dictLabel,
      'dictLabel',
    )}`,
  );
};

export const getAllDictListData = (dictType) => {
  return axiosInstance.get(`/dict/page?${fieldIsNull(dictType, 'dictType')}`);
};

export const addDictData = (body) => {
  return axiosInstance.post('/dict/add', body);
};

export const editDictData = (body) => {
  return axiosInstance.post('/dict/edit', body);
};

export const delDictData = (id) => {
  return axiosInstance.post(`/dict/del?id=${id}`);
};
