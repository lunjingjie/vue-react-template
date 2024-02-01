import mitt from 'mitt';
import { getRawRoute } from '@/utils';
import { menuList } from '@/stores/aside';
import { toRaw } from 'vue';
import routeList from '@/plugins/router/routerList';
import type { RouteLocationNormalized } from 'vue-router';

const emitter = mitt<{
  [key]: RouteLocationNormalized;
}>();

const key = Symbol();

let lastChangeTab: RouteLocationNormalized;

export const setRouteChange = (lastChangeTab: RouteLocationNormalized) => {
  // 获取普通路由对象
  const r = getRawRoute(lastChangeTab);
  const menuStore = menuList();
  const transformArr = deepTraversal(toRaw(menuStore.asideMenu));
  const formatRoute = matchPath(transformArr, r.fullPath);
  if (formatRoute) {
    emitter.emit(key, formatRoute);
    lastChangeTab = formatRoute;
  } else {
    // 保存当前路由
    lastChangeTab = r;
  }
};

type MenuData = {
  url: string;
  name: string;
  icon: string;
  children?: MenuData[];
  title: string;
  [key: string]: any;
};

type MenuResultData = {
  name: string;
  icon: string;
  children?: MenuResultData[];
  title: string;
  path: string;
  [key: string]: any;
} & RouteLocationNormalized;

const deepTraversal = (data: MenuData[]) => {
  const result: MenuResultData[] = [];
  data.forEach((item) => {
    const loop = (data: MenuData) => {
      result.push({
        path: data.url,
        name: data.name,
        title: data.name,
        icon: data.icon,
      });
      const child = data.children;
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });
  return result;
};

const matchPath = (arr: MenuResultData[], fullpath: string) => {
  // 判断当前路由是否配置菜单
  let arrFlag = false;
  routeList.forEach((res) => {
    if (res.children !== undefined) {
      res.children.forEach((item) => {
        if (item.path === fullpath) {
          arrFlag = true;
        }
      });
    }
  });
  const result = arr.find(
    (item) => item.path === fullpath || (fullpath.indexOf(item.path) !== -1 && arrFlag),
  );
  return result;
};

export const listenerRouteChange = (
  callback: (route: RouteLocationNormalized) => void,
  immediate = true,
) => {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
};

export const removeTabChangeListener = () => {
  emitter.clear();
};
