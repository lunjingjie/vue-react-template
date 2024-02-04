import { router } from '@/plugins/router';
import { getKeyValueByTree } from '@/utils';
import { menuList } from '@/stores/aside';
import type { App } from 'vue';

interface AuthExtendedElement extends HTMLElement {
  _parentNode?: HTMLElement | null;
  _placeholderNode: Comment;
}

let cacheMenuList: Array<{ url: string; children?: Array<{ permission: string }> }> = [];

// 纳入按钮权限管理的key
// const authBtnType = ['add', 'delete', 'edit', 'download', 'upload'];
const authBtnType: string[] = [];

const hasPermission = (value: string): boolean => {
  if (!cacheMenuList.length) {
    const menuStore = menuList();
    cacheMenuList = menuStore.asideMenu;
  }
  if (authBtnType.indexOf(value) === -1) {
    return true;
  }
  const currentRoutePath = router.currentRoute.value.path;
  const routeChidren = getKeyValueByTree(cacheMenuList, 'url', currentRoutePath, 'children');

  // 确保 routeChildren 存在并有权限字段
  return routeChidren?.some((item: any) => item.permission?.includes(value));
};

const isAuth = (el: HTMLElement, binding: any) => {
  const value = binding.value;
  if (!value) {
    return;
  }

  if (!hasPermission(value)) {
    el.parentNode && el.parentNode.removeChild(el);
  }
};

const removeEl = (el: AuthExtendedElement) => {
  // 在绑定元素上存储父级元素
  el._parentNode = el.parentNode as AuthExtendedElement['_parentNode'];
  // 在绑定元素上存储一个注释节点
  el._placeholderNode = document.createComment('auth');
  // 使用注释节点来占位
  el.parentNode && el.parentNode.replaceChild(el._placeholderNode, el);
};

const addEl = (el: AuthExtendedElement) => {
  el._parentNode && el._parentNode?.replaceChild(el, el._placeholderNode);
};

const mounted = (el: HTMLElement, binding: any) => {
  isAuth(el, binding);
};

const updated = (el: AuthExtendedElement, binding: any) => {
  if (binding.value === binding.oldValue) return;
  const oldHasPermission = hasPermission(binding.oldValue);
  const newHasPermission = hasPermission(binding.value);
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

export const setupAuthDirective = (app: App<Element>) => {
  app.directive('auth', authDirective);
};
