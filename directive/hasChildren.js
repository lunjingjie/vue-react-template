const removeEl = (el) => {
  console.log(el);
  el.remove();
};

const mounted = (el) => {
  if (!el.children.length) {
    removeEl(el);
  }
};

const updated = (el) => {
  if (!el.children.length) {
    removeEl(el);
  }
};

const authDirective = {
  mounted,
  updated,
};

export const setupHasChildrenDirective = (app) => {
  app.directive('hasChildren', authDirective);
};
