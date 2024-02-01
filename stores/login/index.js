import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { deleteSession, setSessionValue } from '@/utils/hooks/system/useStorage';
import { router } from '@/plugins/router';
import { deleteTokenInHeader } from '@/plugins/axios';
import { getLoginUserAreaApi, getLoginUserTemplateApi } from '@/api/login';
import { menuList } from '@/stores/aside';
import { menuTreeMock } from '@/mock/menuTree';

export const useLoginStore = defineStore('login', () => {
  const token = ref(null);
  const isLogin = computed(() => (token.value ? true : false));
  const userName = ref('');
  const menuStore = menuList();
  const areaId = ref(null); // 租户配置的areaId
  const timeInterval = ref('4'); // 租户模板配置的时间间隔

  function setToken(value) {
    token.value = value;
  }

  const setUserName = (name) => {
    setSessionValue('userName', name);
    userName.value = name;
  };

  const amendPw = () => {
    router.push({ path: '/systemAmendPw' });
  };

  // 获取登录菜单树
  const getLoginMenuTree = async () => {
    menuStore.asideMenu = menuTreeMock;
  };

  // 获取登录用户的区域信息
  const getLoginUserArea = async () => {
    const { data } = await getLoginUserAreaApi();
    areaId.value = data.data.areaId;
  };

  const getLoginUserTemplate = async () => {
    const { data } = await getLoginUserTemplateApi();
    timeInterval.value = data.data.timeInterval.toString();
  };

  const loginOut = () => {
    setToken(null);
    deleteSession('token');
    deleteTokenInHeader();
    deleteSession('userName');
    deleteSession('userId');
    deleteSession('userPassword');
    deleteSession('menuList');
    deleteSession('shouldLogout');
    // router.push({ path: '/login' });
    //退出时自动刷新，解决退出后动态路由仍存在的问题
    location.reload();
  };

  return {
    token,
    isLogin,
    userName,
    areaId,
    timeInterval,
    setUserName,
    setToken,
    loginOut,
    amendPw,
    getLoginMenuTree,
    getLoginUserArea,
    getLoginUserTemplate,
  };
});
