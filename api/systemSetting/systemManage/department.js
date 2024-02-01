import axiosInstance from '@/plugins/axios';

const Api = {
  OFFICELIST: '/office/page',
  OFFICEBYID: '/office/getById',
  OFFICETREE: '/office/tree',
  ADDOFFICE: '/office/add',
  EDITOFFICE: '/office/edit',
  DELOFFICE: '/office/del',
  OFFICEROLEREL: '/officeRoleRel/saveOrUpdate',
};

export const officeListApi = (current, size, body) => {
  return axiosInstance.get(Api.OFFICELIST + `?current=${current}&size=${size}`, body);
};
export const officeByIdApi = (id) => {
  return axiosInstance.get(Api.OFFICEBYID + `?id=${id}`);
};
export const officeTreeApi = (officeName) => {
  let param = {
    params: {
      officeName: officeName,
    },
  };
  if (officeName == null) {
    param = '';
  }
  return axiosInstance.get(`${Api.OFFICETREE}`, param);
};
export const detailListApi = (current, size, body) => {
  return axiosInstance.get(Api.DETAILLIST + `?current=${current}&size=${size}`, body);
};

export const addOfficeApi = (body) => {
  return axiosInstance.post(Api.ADDOFFICE, body);
};
export const editOfficeApi = (body) => {
  return axiosInstance.post(Api.EDITOFFICE, body);
};

export const delOfficeApi = (id) => {
  return axiosInstance.post(Api.DELOFFICE + `?id=${id}`);
};
