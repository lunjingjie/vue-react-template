import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getScreen } from '../../utils/screen';
import { useDebounceFn } from '@vueuse/core';

export const useCollapsedStore = defineStore('collapsed', () => {
  const collapsed = ref(false);

  function setCollapsed() {
    collapsed.value = !collapsed.value;
  }

  function setCollapsedValue(val) {
    collapsed.value = val;
  }

  function setSideBarCollapse() {
    window.addEventListener(
      'resize',
      useDebounceFn(() => {
        collapsed.value = getScreen();
      }),
      500,
    );
  }

  return { collapsed, setCollapsed, setSideBarCollapse, setCollapsedValue };
});
