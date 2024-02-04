import { createRouter, createWebHistory } from 'vue-router';
import { getSessionValue } from '../../utils/hooks/system/useStorage';
import { setTokenInHeader } from '@/plugins/axios';
import { useLoginStore } from '@/stores/login';
import { useLayoutStore } from '@/stores/layout';
import { basicRoutes } from './routerList';
import { ref } from 'vue';
import { setRouteChange } from '../../utils/routeChange';
import dayjs from 'dayjs';
import { getKeyValueByTree } from '@/utils';
import { menuList } from '@/stores/aside';
import { judgeIsInSpecialRoutes, getNameByPath } from './specialRoutes';
import { useCollapsedStore } from '@/stores/collapsed';

// 白名单
const WHITE_NAME_LIST = [];
const getRouteNames = (array) => {
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name);
    getRouteNames(item.children || []);
  });
};
getRouteNames(basicRoutes);

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: basicRoutes,
  strict: true,
  scrollBehavior: () => ({
    left: 0,
    top: 0,
  }),
});

export function resetRouter() {
  router.getRoutes.forEach((route) => {
    const { name } = route;
    if (name) {
      if (name && !WHITE_NAME_LIST.includes(name)) {
        router.hasRoute(name) && router.removeRoute(name);
      }
    }
  });
}

export function initRouter(app) {
  app.use(router);
}

//获取开始时间
let startTime = Date.now();

//定义一个获取用户的函数
const get_userinfo = async (to, from) => {
  //获取当前时间
  let currentTime = Date.now();
  const params = {
    functionName: judgeIsInSpecialRoutes(from.path)
      ? getNameByPath(from.path)
      : getKeyValueByTree(menuList().asideMenu, 'url', from.path, 'name'), // 菜单名称
    router: from.path, // 路由
    accessTime: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'), // 开始时间
    duration: parseInt((currentTime - startTime) / 1000), // 停留时间
    platform: 0, // 标识
  };
  if (params.functionName && params.duration >= 10 && params.duration <= 3600) {
    try {
      // await newTrackLogApi(params);
    } catch (e) {
      console.error(e);
    }
  }
  //初始化开始时间
  startTime = Date.now();
};

router.beforeEach((to, from, next) => {
  const token = getSessionValue('token');
  const storeLogin = useLoginStore();
  const storeLayout = useLayoutStore();

  // TODO 后续需要考虑F5操作和关闭窗口操作的情况
  get_userinfo(to, from);

  if (token !== null && storeLogin.token === null && to.name !== 'loginPage') {
    storeLogin.setToken(token);
    setTokenInHeader(token);
  }

  if (
    token === null ||
    to.name === 'basePage' ||
    to.name === 'detailPage' ||
    to.name === 'loginPage' ||
    to.name === 'amendPwPage' ||
    to.name === '500Page'
  ) {
    storeLayout.setShowLayout(false);
  } else {
    storeLayout.setShowLayout(true);
  }

  // 收起左侧菜单（一张图模块）
  if (judgeIsInSpecialRoutes(to.path)) {
    useCollapsedStore().setCollapsedValue(true);
  }

  if (judgeIsInSpecialRoutes(from.path) && !judgeIsInSpecialRoutes(to.path)) {
    useCollapsedStore().setCollapsedValue(false);
  }

  // 监听路由变化形成tab
  setRouteChange(to);

  if (token === null) {
    const routename = ref('');
    routename.value = 'loginPage';
    if (to.name !== routename.value) {
      next({ name: routename.value });
    } else {
      next();
    }
  } else if (to.name === 'loginPage') {
    next('/template');
  } else {
    next();
  }
});

router.afterEach((to) => {
  setRouteChange(to);
});
