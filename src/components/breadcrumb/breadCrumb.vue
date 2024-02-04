<template>
  <div class="mx-2 breadcurmb-wrap">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="item in crumbData" :key="item.url">
        {{ item.name }}
        <template #overlay v-if="item.children && item.children.length">
          <a-menu>
            <a-menu-item v-for="sub in item.children" :key="sub.url" @click="goPage(sub.url)">
              {{ sub.name }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script setup name="breadcrumb" lang="ts">
  import { watch, ref, computed } from 'vue';
  import { router } from '../../plugins/router';
  import { menuList } from '@/stores/aside';
  import { find, deepClone } from '@/utils';
  import { useGo } from '@/hooks/web/usePage';
  import { getSessionValue } from '@/utils/hooks/system/useStorage';
  import { mapItemsConstant } from '@/constants/pageConstant';

  let menuAsideList = computed(() => {
    return menuList().asideMenu;
  });
  const crumbData = ref([]);
  const go = useGo();

  // 自定义一张图的breadcrumb
  const mapMenuList = [
    {
      name: 'GIS一张图',
      url: 'GIS一张图',
    },
  ];

  watch(router.currentRoute, (val) => {
    const { path } = val;
    if (mapItemsConstant[path.replace('/', '')]) {
      crumbData.value = [
        ...mapMenuList,
        {
          name: mapItemsConstant[path.replace('/', '')],
          url: path,
          children: Object.keys(mapItemsConstant).map((key) => ({
            name: mapItemsConstant[key],
            url: `/${key}`,
          })),
        },
      ];
      return;
    }

    const result = find(menuAsideList.value, 'url', path, 'name', true);
    // 把同级菜单数组移到所选菜单对象下，提供切换选择功能
    const source = deepClone(result);
    const target = [];
    source.forEach((item, index) => {
      target.push(item);
      if (index > 0 && target[index - 1].children && target[index - 1].children.length) {
        target[index].children = target[index - 1].children;
        if (index - 1 === 0) {
          target[index - 1].children = [];
        }
      }
    });
    crumbData.value = target;
  });

  const goPage = (url) => {
    if (url.startsWith('http')) {
      window.open(`${url}?token=${getSessionValue('token')}`);
      return;
    }
    go(url);
  };
</script>
<style lang="scss">
  .custom-dropdown-trigger > .anticon.anticon-down,
  .custom-dropdown-link > .anticon.anticon-down,
  .custom-dropdown-button > .anticon.anticon-down {
    line-height: 22px !important;
  }
</style>
