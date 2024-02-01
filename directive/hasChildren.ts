import type { App } from 'vue';

const removeEl = (el: HTMLElement) => {
  console.log(el);
  el.remove();
};

const mounted = (el: HTMLElement) => {
  if (!el.children.length) {
    removeEl(el);
  }
};

const updated = (el: HTMLElement) => {
  if (!el.children.length) {
    removeEl(el);
  }
};

const authDirective = {
  mounted,
  updated,
};

export const setupHasChildrenDirective = (app: App<Element>) => {
  app.directive('hasChildren', authDirective);
};
