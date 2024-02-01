<template>
  <a-menu :selectedKeys="menuState.selectedKeys" :mode="mode" @click="handleMenuClick">
    <template v-for="item in items" :key="item.path">
      <BasicSubMenuItem :item="item" :isHorizontal="isHorizontal"></BasicSubMenuItem>
    </template>
  </a-menu>
</template>
<script setup name="BasicMenu">
  import { reactive, toRefs } from 'vue';
  import BasicSubMenuItem from './src/components/BasicSubMenuItem.vue';
  import { basicProps } from './props';
  import { useGo } from '@/hooks/web/usePage';

  const menuState = reactive({
    selectedKeys: [],
    defaultSelectedKeys: [],
  });

  const props = defineProps(basicProps);

  const { items, mode } = toRefs(props);

  const go = useGo();

  const handleMenuClick = ({ key }) => {
    go(key);
  };
</script>
<style scoped lang="scss">
  .ant-menu-horizontal {
    border-bottom: none !important;
  }
</style>
