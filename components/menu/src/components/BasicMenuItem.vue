<template>
  <MenuItem :key="item.path" :title="item.title">
    <MenuItemContent v-bind="props" :item="item" />
  </MenuItem>
</template>
<script setup name="BasicMenuItem">
  import { Menu } from 'ant-design-vue';
  import { itemProps } from '../../props';

  import MenuItemContent from './MenuItemContent.vue';

  const MenuItem = Menu.Item;
  const props = defineProps(itemProps);
</script>
