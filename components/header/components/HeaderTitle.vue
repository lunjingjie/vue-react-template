<template>
  <div class="anticon app-logo layout-header-logo header-action__item" @click="goHome">
    <!-- <img src="../../../assets/logo.png" /> -->
    <div class="ml-2 truncate md:opacity-100 app-logo__title">
      {{ title }}
    </div>
  </div>
</template>
<script setup>
  import { useGlobSetting } from '@/hooks/setting';
  import { useGo } from '@/hooks/web/usePage';
  import { pageConstant } from '../../../constants/pageConstant';

  const { title } = useGlobSetting();
  const go = useGo();

  function goHome() {
    go(pageConstant.BASE_HOME);
  }
</script>
<!-- <style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
      transition: all 0.5s;
      line-height: normal;
    }
  }
</style> -->
