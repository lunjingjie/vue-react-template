<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" @select="selectOption(current)">
    <a-menu-item :key="item.id" v-for="item in list">
      <template #icon>
        <mail-outlined />
        <component :is="$antdVueIcons[item.icon]" />
      </template>
      {{ item.name }}
    </a-menu-item>
  </a-menu>
</template>
<script setup>
  // eslint-disable-next-line no-unused-vars
  import { defineComponent, ref } from 'vue';
  // eslint-disable-next-line no-unused-vars
  import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
  import { menuList } from '@/stores/aside/index.js';
  import { getSessionValue } from '@/utils/hooks/system/useStorage';

  const arr = menuList();
  const menu = JSON.parse(getSessionValue('menuList'));

  const list = menu[0].children;
  // const list = arr.menu[0].children;

  const selectOption = (item) => {
    list.forEach((element) => {
      if (item[0] === element.id) {
        arr.asideMenu = element.children;
      }
    });
  };
</script>
