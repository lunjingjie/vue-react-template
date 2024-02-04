<template>
  <a-layout class="layout-total">
    <app-sider v-if="storeLogin.isLogin && storeLayout.showLayout"></app-sider>
    <a-layout>
      <app-header v-if="storeLogin.isLogin && storeLayout.showLayout"></app-header>
      <a-divider style="margin: 0" />
      <div style="background: #fff" v-show="storeLogin.isLogin">
        <LayoutTab></LayoutTab>
      </div>
      <a-layout-content
        id="layoutContent"
        :style="{
          margin: storeLayout.showLayout ? '8px 8px' : '',
          padding: storeLayout.showLayout ? '5px' : '',
          // background: storeLayout.showLayout ? '#fff' : '',
          minHeight: storeLayout.showLayout ? '280px' : '',
        }"
        style="overflow-y: hidden"
        class="scroll-bar"
      >
        <!-- storeLayout.isRouterAlive 用于刷新数据面板模块 -->
        <router-view v-slot="{ Component, route }" v-if="storeLayout.isRouterAlive">
          <div style="height: 100%">
            <keep-alive :include="tabCacheList">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </div>
        </router-view>
      </a-layout-content>
      <AppFooter />
    </a-layout>
  </a-layout>
  <a-modal v-model:visible="storeLayout.showModel" width="500px">
    <template #title>
      <div style="font-size: 16px; color: #fc9027; font-weight: bold">
        <ExclamationCircleOutlined /> 弱密码提示
      </div>
    </template>
    <template #footer>
      <a-button key="back" @click="storeLayout.showModel = false">下次更改</a-button>
      <a-button type="primary" @click="toAmendPw">确认</a-button>
    </template>
    <div></div>
    <div style="align-items: center"> 系统监测到当前账号密码为弱密码，是否更改密码？ </div>
  </a-modal>
</template>
<script setup>
  import AppSider from '@/components/layout/AppSider.vue';
  // import AppTab from '@/components/layout/AppTab.vue';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import { useLoginStore } from '@/stores/login/index.js';
  import { useLayoutStore } from '@/stores/layout/index.js';
  import { router } from '@/plugins/router';
  import { computed, watch } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import LayoutTab from '@/components/tabs/indexPage.vue';
  import { useMultipleTabStore } from '@/stores/multipleTab';
  import AppFooter from './AppFooter.vue';
  // import CryptoJS from 'crypto-js';
  // import { useGlobSetting } from '@/hooks/setting';

  // const encryptDES = (originText, key) => {
  //   const keyHex = CryptoJS.enc.Utf8.parse(key);
  //   if (originText) {
  //     const encrypt = CryptoJS.DES.encrypt(originText, keyHex, {
  //       mode: CryptoJS.mode.ECB,
  //       padding: CryptoJS.pad.Pkcs7,
  //     });
  //     return encrypt.toString();
  //   }
  //   return '';
  // };
  // console.log(encryptDES('Create80&wdp3', 'I/Ex4wjgGgs='));

  const storeLogin = useLoginStore();
  const storeLayout = useLayoutStore();
  const tabStore = useMultipleTabStore();
  const tabCacheList = computed(() => {
    return tabStore.getCachedTabList;
  });

  watch(router.currentRoute, () => {
    document.getElementById('layoutContent').scrollTo(0, 0);
  });
  const toAmendPw = () => {
    storeLayout.showModel = false;
    router.push({ path: '/systemAmendPw' });
  };
</script>
<style>
  .layout-total {
    height: 100vh !important;
    overflow-y: hidden;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #e5e3e300;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #dddee0;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #c7c9cc;
  }
</style>
