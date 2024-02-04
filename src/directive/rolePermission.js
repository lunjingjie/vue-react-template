import { router } from '@/plugins/router';
import { getKeyValueByTree } from '@/utils';
import { menuList } from '@/stores/aside';

let cacheMenuList = [];

// 纳入按钮权限管理的key
// const authBtnType = ['add', 'delete', 'edit', 'download', 'upload'];
const authBtnType = [];

const hasPermission = (value) => {
  if (!cacheMenuList.length) {
    const menuStore = menuList();
    cacheMenuList = menuStore.asideMenu;
  }
  if (authBtnType.indexOf(value) === -1) {
    return true;
  }
  const currentRoutePath = router.currentRoute.value.path;
  const routeChidren = getKeyValueByTree(cacheMenuList, 'url', currentRoutePath, 'children');
  return routeChidren.map((item) => item.permission).includes(value);
};

const isAuth = (el, binding) => {
  const value = binding.value;
  if (!value) {
    return;
  }

  if (!hasPermission(value)) {
    el.parentNode && el.parentNode.removeChild(el);
  }
};

const removeEl = (el) => {
  // 在绑定元素上存储父级元素
  el._parentNode = el.parentNode;
  // 在绑定元素上存储一个注释节点
  el._placeholderNode = document.createComment('auth');
  // 使用注释节点来占位
  el.parentNode && el.parentNode.replaceChild(el._placeholderNode, el);
};

const addEl = (el) => {
  el._parentNode && el._parentNode.replaceChild(el, el._placeholderNode);
};

const mounted = (el, binding) => {
  isAuth(el, binding);
};

const updated = (el, binding) => {
  if (binding.value === binding.oldValue) return;
  let oldHasPermission = hasPermission(binding.oldValue);
  let newHasPermission = hasPermission(binding.value);
  if (oldHasPermission === newHasPermission) return;
  if (newHasPermission) {
    addEl(el);
  } else {
    removeEl(el);
  }
};

const authDirective = {
  mounted,
  updated,
};

export const setupAuthDirective = (app) => {
  app.directive('auth', authDirective);
};
