<template>
  <div>
    <a-tabs
      class="multi-tabs"
      :activeKey="activeKeyRef"
      type="editable-card"
      size="small"
      :animated="false"
      :hideAdd="true"
      @change="handleChange"
      @edit="handleEdit"
    >
      <template v-for="item in getTabsState" :key="item.query ? item.fullPath : item.path">
        <a-tab-pane
          :closable="!(item && item.meta && item.meta.affix) && item.path !== '/template'"
        >
          <template #tab>
            <div>
              <span>
                <Icon :icon="prefixIconType(item)" size="15" />
              </span>
              <span style="font-size: 12px">{{ getTitle(item) }}</span>
            </div>
          </template>
        </a-tab-pane>
      </template>
      <template #rightExtra>
        <a-dropdown placement="bottomLeft" class="header-comp">
          <Icon icon="ic:baseline-menu" size="20" color="#606266"></Icon>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="closeOtherTab">关闭其它</a-menu-item>
              <a-menu-item @click="closeAllTab">关闭全部</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tabs>
  </div>
</template>
<script setup name="TabPage">
  import { computed, ref, unref } from 'vue';
  import { useMultipleTabStore } from '@/stores/multipleTab/index.js';
  import { listenerRouteChange } from '@/utils/routeChange.js';
  import { useGo } from '@/hooks/web/usePage';
  import { useRouter } from 'vue-router';
  import './multiTab.scss';

  const activeKeyRef = ref('');
  const tabStore = useMultipleTabStore();
  const router = useRouter();
  const go = useGo();

  const getTabsState = computed(() => {
    return tabStore.getTabList;
  });

  const closeOtherTab = () => {
    tabStore.closeOtherTab(router);
  };

  const closeAllTab = () => {
    tabStore.closeAllTab(router);
  };

  const prefixIconType = (tabItem) => {
    if (tabItem.icon) {
      return tabItem.icon;
    } else if (tabItem.path === '/homepage') {
      return 'ant-design:home-outlined';
    } else {
      return 'ant-design:code';
    }
  };

  const getTitle = (tabItem) => {
    return tabItem.title;
  };

  // 监听路由变化
  listenerRouteChange((route) => {
    const { path, fullPath } = route;
    const p = fullPath || path;
    if (activeKeyRef.value !== p) {
      activeKeyRef.value = p;
    }
    tabStore.addTab(unref(route));
  });

  // tab点击事件
  const handleChange = (activeKey) => {
    tabStore.setCurrentTabIndexByClick(activeKey);
    activeKeyRef.value = activeKey;
    go(activeKey, false);
  };

  // tab删除事件
  const handleEdit = (targetKey) => {
    tabStore.closeTabByKey(targetKey, router);
  };
</script>
