<template>
  <a-layout-sider v-model:collapsed="collasp" :trigger="null" collapsible class="side-bar">
    <div class="asideImg" v-if="collasp">
      <a-image
        :src="wdpLogo"
        :width="40"
        :preview="false"
        style="height: 40px; padding: 5px; margin-top: 5px"
      />
    </div>
    <div
      class="asideImg"
      style="display: flex; flex-direction: row; justify-content: space-around; padding-top: 8px"
      v-else
    >
      <a-image :src="wdpLogo" :width="40" :preview="false" style="height: 40px; padding: 5px" />
      <span
        style="
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          position: relative;
          top: 12px;
          left: -35px;
        "
        >示例模板</span
      >
    </div>
    <a-menu
      class="side-menu"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="light"
      style="color: #fff"
    >
      <template v-for="item in menuAsideList" :key="item.url">
        <a-menu-item
          :id="item.url.slice(1)"
          v-if="!item.children || item.children.length === 0"
          :key="item.url"
          @click="redirectPage(item.url)"
        >
          <Icon v-if="getIcon(item)" :icon="getIcon(item)" :size="18" class="mr-2" />
          <span>{{ item.name }}</span>
        </a-menu-item>
        <a-sub-menu
          v-else-if="item.url !== '/realTimeGis'"
          :key="`sub${item.name}`"
          :id="item.name"
        >
          <template #icon>
            <Icon v-if="getIcon(item)" :icon="getIcon(item)" :size="18" class="mr-2" />
          </template>
          <template #title>{{ item.name }}</template>
          <a-menu-item @click="redirectPage(sub.url)" v-for="sub in item.children" :key="sub.url">
            <Icon v-if="getIcon(sub)" :icon="getIcon(sub)" :size="18" class="mr-2" />
            <span :title="sub.name">{{ sub.name }}</span></a-menu-item
          >
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
  import { useCollapsedStore } from '@/stores/collapsed';
  import { ref, watch, computed } from 'vue';
  import { router } from '../../plugins/router';
  import { menuList } from '@/stores/aside';
  import { isNull2ReturnValue, find } from '@/utils';
  // import miniLogoLight from '../../assets/images/logo/mini-logo-light.png';
  // import fullLogoLight from '../../assets/images/logo/full-logo-light.png';
  import wdpLogo from '../../assets/images/logo/wdp-icon-light.png';
  import { getSessionValue } from '@/utils/hooks/system/useStorage';
  import { useLayoutStore } from '@/stores/layout';
  import './AppSider.scss';

  const storeLayout = useLayoutStore();

  const storeCollapsed = useCollapsedStore();

  const collasp = computed(() => {
    return storeCollapsed.collapsed;
  });

  const selectedKeys = ref([]);
  const openKeys = ref([]);

  let menuAsideList = computed(() => {
    return menuList().asideMenu;
  });

  const redirectPage = (url) => {
    // 点击数据版面的时候刷新当前页面
    if (url === '/board') {
      storeLayout.reload();
    }
    // 如果是以http开头，则直接跳转
    if (url.startsWith('http')) {
      window.open(`${url}?token=${getSessionValue('token')}`);
      return;
    }
    router.push({ path: url });
  };

  watch(router.currentRoute, (val) => {
    const { path } = val;
    const result = find(menuAsideList.value, 'url', path, 'name');
    if (result.length >= 2 && !collasp.value) {
      openKeys.value = [`sub${result.slice(-2, -1)[0]}`];
    }
    selectedKeys.value = [path];
  });

  const getIcon = (item) => isNull2ReturnValue(item, 'icon', '');

  storeCollapsed.setSideBarCollapse();
</script>
