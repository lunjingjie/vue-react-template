<template>
  <a-config-provider
    :locale="zhCN"
    prefix-cls="custom"
    :theme="{
      token: {
        colorPrimary: ColorTheme.primaryColor,
      },
      algorithm: systemTheme === 'dark' ? theme.darkAlgorithm : [],
    }"
  >
    <div style="width: 100%; height: 100%">
      <app-layout></app-layout>
    </div>
  </a-config-provider>
</template>
<script setup>
  import { computed } from 'vue';
  import { theme } from 'ant-design-vue';
  import AppLayout from '@/components/layout/AppLayout.vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { getSessionValue } from '@/utils/hooks/system/useStorage';
  import axiosInstance, { setTokenInHeader } from '@/plugins/axios';
  import { useLoginStore } from '@/stores/login';
  import { menuList } from '@/stores/aside';
  import { useGo } from '@/hooks/web/usePage';
  import { useUserMouseMove, confirmFunc } from '@/hooks/web/useUserMouseMove';
  import { useLayoutStore } from '@/stores/layout';
  import { ColorTheme } from '@/constants';

  const store = useLayoutStore();
  const systemTheme = computed(() => {
    return store.systemTheme;
  });

  // init theme
  document.documentElement.setAttribute('theme', 'light');

  setTokenInHeader(getSessionValue('token'));

  useUserMouseMove(30 * 60);

  const go = useGo();

  if (JSON.parse(getSessionValue('shouldLogout'))) {
    confirmFunc();
  }

  if (axiosInstance.defaults.headers.common.Authorization) {
    const loginStore = useLoginStore();
    loginStore.getLoginMenuTree().then(() => {
      const menuStore = menuList();
      if (menuStore.asideMenu.length === 0) {
        go('/404');
      } else {
        // useBaseData();
      }
    });
    // 初始化系统数据
  }
</script>
