import { defineStore } from 'pinia';
import { getRawRoute, deepClone } from '@/utils';
import { toRaw, unref } from 'vue';
import { pageConstant } from '@/constants/pageConstant';
import routeList from '@/plugins/router/routerList';
import { menuList } from '@/stores/aside';

const getToTarget = (tabItem) => {
  const { params, path, query } = tabItem;
  return {
    params: params || {},
    path,
    query: query || {},
  };
};

export const useMultipleTabStore = defineStore({
  id: 'multipleTab',
  state: () => ({
    cacheTabList: new Set(['boardPage']),
    tabList: [
      {
        path: '/template',
        name: '示例页面',
        title: '示例页面',
        icon: 'ant-design:database-outlined',
      },
    ],
    currentTabIndex: 0,
  }),
  getters: {
    getTabList() {
      return menuList().asideMenu.length ? this.tabList : [];
    },
    getCachedTabList() {
      return Array.from(this.cacheTabList);
    },
  },
  actions: {
    setCurrentTabIndexByClick(path) {
      const index = this.tabList.findIndex((item) => item.path === path);
      this.currentTabIndex = index;
    },
    updateCacheTab() {
      const cacheMap = new Set();
      for (const tab of this.tabList) {
        const item = getRawRoute(tab);
        const needCache = true;
        if (!needCache) {
          continue;
        }
        const { name } = routeList.find((route) => route.path === item.path);
        cacheMap.add(name);
      }
      this.cacheTabList = cacheMap;
    },
    addTab(route) {
      const { fullPath, path, params, query } = getRawRoute(route);
      let updateIndex = -1;
      const tabHasExist = this.tabList.some((tab, index) => {
        updateIndex = index;
        return (tab.fullPath || tab.path) === (fullPath || path);
      });

      if (tabHasExist) {
        const curTab = toRaw(this.tabList)[updateIndex];
        if (!curTab) {
          return;
        }
        curTab.params = params || curTab.params;
        curTab.query = query || curTab.query;
        curTab.fullPath = fullPath || curTab.fullPath;
        this.tabList.splice(updateIndex, 1, curTab);
      } else {
        this.tabList.push(route);
      }
      this.currentTabIndex = this.tabList.length - 1;
      this.updateCacheTab();
    },
    closeOtherTab(router) {
      deepClone(this.tabList).forEach((tab, index) => {
        if (this.currentTabIndex !== index && index !== 0) {
          this.closeTab(tab, router);
        }
      });
    },
    closeAllTab(router) {
      deepClone(this.tabList).forEach((tab, index) => {
        if (index !== 0) {
          this.closeTab(tab, router);
        }
      });
    },
    async closeTab(tab, router) {
      const close = (route) => {
        const { path } = route;
        const index = this.tabList.findIndex((item) => item.path === path);
        if (index !== -1) {
          this.tabList.splice(index, 1);
        }
      };

      const { currentRoute, replace } = router;
      const { path } = unref(currentRoute);
      if (path !== tab.path) {
        close(tab);
        return;
      }

      let toTarget = {};
      const index = this.tabList.findIndex((item) => item.path === path);
      // 如果是最左边的tab
      if (index === 0) {
        if (this.tabList.length === 1) {
          toTarget = pageConstant.BASE_HOME;
        } else {
          const page = this.tabList[index + 1];
          toTarget = getToTarget(page);
        }
      } else {
        const page = this.tabList[index - 1];
        toTarget = getToTarget(page);
      }
      this.currentTabIndex = index;
      close(currentRoute.value);
      await replace(toTarget);
    },
    async closeTabByKey(key, router) {
      const index = this.tabList.findIndex((item) => (item.fullPath || item.path) === key);
      if (index !== -1) {
        await this.closeTab(this.tabList[index], router);
        const { currentRoute, replace } = router;
        // 检查当前路由是否存在于tabList中
        const isActivated = this.tabList.findIndex(
          (item) => item.fullPath === currentRoute.value.fullPath,
        );
        if (isActivated === -1) {
          let pageIndex;
          if (index > 0) {
            pageIndex = index - 1;
          } else if (index < this.tabList.length - 1) {
            pageIndex = index + 1;
          } else {
            pageIndex = -1;
          }
          if (pageIndex >= 0) {
            const page = this.tabList[index - 1];
            const toTarget = getToTarget(page);
            await replace(toTarget);
          }
          this.currentTabIndex = pageIndex;
        }
      }
      this.updateCacheTab();
    },
  },
});
