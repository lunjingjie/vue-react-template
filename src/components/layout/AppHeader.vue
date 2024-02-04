<template>
  <a-layout-header
    v-show="route.path !== '/login'"
    style="padding: 0 20px; height: 49px !important; line-height: 48px !important; z-index: 1000"
    :style="{ background: systemTheme === 'dark' ? '#141414' : '#fff' }"
  >
    <FlexBox
      flexDirection="row"
      justifyContent="space-between"
      style="{ margin: '0 10px', height: '48px' }"
    >
      <FlexBox
        flexDirection="row"
        justifyContent="space-between"
        style="{ margin: '0 10px', height: '48px' }"
      >
        <!-- <HeaderTitle></HeaderTitle> -->
        <menu-unfold-outlined
          v-if="store.collapsed"
          class="trigger header-comp"
          @click="store.setCollapsed()"
        />
        <menu-fold-outlined v-else class="trigger header-comp" @click="store.setCollapsed()" />
        <!-- <HeaderTitle></HeaderTitle> -->
        <BreadCrumb></BreadCrumb>
        <!-- <App-top-nav style="margin-left: 10px"></App-top-nav> -->
        <!-- <LayoutMenu :isHorizontal="true"></LayoutMenu> -->
      </FlexBox>
      <FlexBox
        flexDirection="row"
        justifyContent="space-between"
        style="{ margin: '0 5px', height: '48px' }"
      >
        <div class="header-comp" @click="openGuide">
          <Icon icon="mdi-help-circle-outline" size="14" color="#606266"></Icon>
          <span style="font-size: 14px; padding-left: 5px">新手引导</span>
        </div>
        <FullScreen class="header-comp"></FullScreen>
        <ThemeSwitch class="header-comp"></ThemeSwitch>
        <a-dropdown placement="bottomLeft" class="header-comp">
          <div>
            <Icon icon="mdi-account-circle" size="26" :color="ColorTheme.primaryColor"></Icon>
            <span class="user-admin" style="padding-left: 10px; color: var(--account-text-color)">{{
              userName
            }}</span>
          </div>
          <template #overlay>
            <a-menu>
              <!-- <a-menu-item @click="amendPw"> 更改密码 </a-menu-item> -->
              <a-menu-item><ordered-list-outlined style="margin-right: 5px" />操作手册</a-menu-item>
              <a-menu-item><team-outlined style="margin-right: 5px" />关于系统 </a-menu-item>
              <a-menu-item @click="loginOut"
                ><logout-outlined style="margin-right: 5px" />
                <!-- <span class="iconify" style="font-size: 16px" data-icon="ion:power-outline"></span> -->
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </FlexBox>
    </FlexBox>
  </a-layout-header>
</template>
<script setup lang="ts">
  import { useCollapsedStore } from '@/stores/collapsed';
  import { useLoginStore } from '../../stores/login';
  import { getSessionValue } from '@/utils/hooks/system/useStorage';
  import { ref, computed } from 'vue';
  import { FullScreen, ThemeSwitch } from '../header';
  import BreadCrumb from '../breadcrumb/breadCrumb.vue';
  // eslint-disable-next-line no-unused-vars
  import { useRoute } from 'vue-router';
  const route = useRoute();
  import FlexBox from '@/components/FlexBox/flexWrap.vue';
  // import { HeaderTitle } from '@/componets/header';
  // import LayoutMenu from '@/components/header/components/menu/LayoutMenu.vue';
  import { useIntro } from '@/hooks/web/useIntro';
  import GIS from '@/assets/tour_gif/GIS.gif';
  import dataCenter from '@/assets/tour_gif/dataCenter.gif';
  import alarmCenter from '@/assets/tour_gif/alarmCenter.gif';
  import eventCenter from '@/assets/tour_gif/eventCenter.gif';
  import analysis from '@/assets/tour_gif/analysis.gif';
  import { ColorTheme } from '@/constants';
  import { useLayoutStore } from '@/stores/layout';

  const layoutStore = useLayoutStore();
  const systemTheme = computed(() => {
    return layoutStore.systemTheme;
  });

  const { loginOut } = useLoginStore();
  const store = useCollapsedStore();
  const userName = ref(getSessionValue('userName'));

  const { startIntro } = useIntro({
    steps: [
      // {
      //   intro: '欢迎使用白海豚v3.0，请点击下一步进入产品引导👋',
      //   position: 'right',
      //   title: '白海豚v3.0产品引导',
      // },
      {
        element: '#数据中心',
        intro: `<img style="width: 400px; height: 212px;" src="${dataCenter}"/>
        <div style="color: #555557; font-size: 13px; padding: 16px; margin-top: 10px;">监测站点多维度数据查询与统计，为河道水质演变分析提供辅助参考支撑</div>`,
        position: 'right',
        title: '数据中心',
      },
      {
        element: '#告警中心',
        intro: `<img style="" src="${alarmCenter}"/>
        <div style="color: #555557; font-size: 13px; padding: 16px; margin-top: 10px;">可配置化告警规则，实现智能预警多元化，异常信息及时推送</div>`,
        position: 'right',
        title: '告警中心',
      },
      {
        element: '#智慧指挥中心',
        intro: `<img style="width: 400px; height: 212px;" src="${eventCenter}"/>
        <div style="color: #555557; font-size: 13px; padding: 16px; margin-top: 10px;">基于水环境问题分类分级预警响应闭环应用，为水环境问题高效解决提供支持</div>`,
        position: 'right',
        title: '智慧指挥中心',
      },
      {
        element: '#决策支撑',
        intro: `<img style="width: 400px; height: 212px;" src="${analysis}"/>
        <div style="color: #555557; font-size: 13px; padding: 16px; margin-top: 10px;">利用大数据技术挖掘数据之间的关系，结合多维度数据、多种环境质量模型，甑别影响区域水质质量的主要因素，实现靶向控源和精准治污</div>`,
        position: 'right',
        title: '决策支撑',
      },
      {
        element: '#intro-gis',
        intro: `<img style="width: 400px; height: 212px;" src="${GIS}"/>
        <div style="color: #555557; font-size: 13px; padding: 16px; margin-top: 10px;">整合GIS一张图分析，及时有效地全面反映水质状况，预见可能的变化</div>`,
        position: 'bottom',
        title: 'GIS一张图',
      },
    ],
  });

  const openGuide = () => {
    // await nextTick();
    startIntro();
  };
</script>

<style lang="scss" scoped>
  .header-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    bottom: 5px;
  }

  .user-admin {
    font-weight: bold;
    font-size: 14px;
  }

  .user-admin:hover {
    cursor: pointer;
  }
</style>
