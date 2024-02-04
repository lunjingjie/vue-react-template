import mitt from 'mitt';
import { getRawRoute } from '@/utils';
import { menuList } from '@/stores/aside/index.js';
import { toRaw } from 'vue';
import routeList from '@/plugins/router/routerList';

const emitter = mitt();

const key = Symbol();

let lastChangeTab;

export const setRouteChange = (lastChangeTab) => {
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

const deepTraversal = (data) => {
  const result = [];
  data.forEach((item) => {
    const loop = (data) => {
      result.push({
        path: data.url,
        name: data.name,
        title: data.name,
        icon: data.icon,
      });
      let child = data.children;
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

const matchPath = (arr, fullpath) => {
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

export const listenerRouteChange = (callback, immediate = true) => {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
};

export const removeTabChangeListener = () => {
  emitter.clear();
};
