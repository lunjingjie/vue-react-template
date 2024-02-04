import axiosInstance from '../../plugins/axios';

const Api = {
  MENU_TREE: 'menu/tree',
  MENU_TREE_NAME: '/menu/getTreeByName',
  MENU_SAVE: '/menu/save',
  MENU_DELETE: '/menu/delete',
  MENU_USER: '/menu/getTreeByUser',
};

export const menuListApi = (name) => {
  return axiosInstance.get(Api.MENU_TREE, {
    params: {
      name: name,
    },
  });
};

export const menuNameApi = (name) => {
  return axiosInstance.get(Api.MENU_TREE_NAME, {
    params: {
      name,
    },
  });
};

export const menuSaveApi = (body) => {
  return axiosInstance.post(Api.MENU_SAVE, body);
};

export const menuDeleteApi = (body) => {
  return axiosInstance.post(Api.MENU_DELETE, body);
};

export const menuUserApi = () => {
  return axiosInstance.get(Api.MENU_USER);
};
