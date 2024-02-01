<template>
  <BasicMenuItem v-if="!menuHasChildren(item)" v-bind="$props" />
  <SubMenu
    v-if="menuHasChildren(item)"
    :key="`submenu-${item.path}`"
    popupClassName="app-top-menu-popup"
  >
    <template #title>
      <MenuItemContent v-bind="$props" :item="item" />
    </template>

    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <BasicSubMenuItem v-bind="$props" :item="childrenItem" />
    </template>
  </SubMenu>
</template>
<script>
  import { defineComponent } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { itemProps } from '../../props';
  import BasicMenuItem from './BasicMenuItem.vue';
  import MenuItemContent from './MenuItemContent.vue';

  export default defineComponent({
    name: 'BasicSubMenuItem',
    isSubMenu: true,
    components: {
      BasicMenuItem,
      SubMenu: Menu.SubMenu,
      MenuItemContent,
    },
    props: itemProps,
    setup() {
      function menuHasChildren(menuTreeItem) {
        return (
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }
      return {
        menuHasChildren,
      };
    },
  });
</script>
