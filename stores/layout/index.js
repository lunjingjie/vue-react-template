/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: Aidam_Bo
 * @Date: 2023-02-07 09:08:22
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2023-02-23 16:59:46
 */
import { ref, nextTick } from 'vue';
import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', () => {
  const isRouterAlive = ref(true);
  const showLayout = ref(false);
  const showMode = ref(false);
  const systemTheme = ref('light');
  function setShowLayout(type) {
    showLayout.value = type;
  }
  const reload = () => {
    isRouterAlive.value = false;
    nextTick(() => {
      isRouterAlive.value = true;
    });
  };

  const setTheme = (theme) => {
    systemTheme.value = theme;
  };

  return { showLayout, setShowLayout, showMode, isRouterAlive, reload, systemTheme, setTheme };
});
