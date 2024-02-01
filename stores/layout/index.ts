import { ref, nextTick } from 'vue';
import { defineStore } from 'pinia';

enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export const useLayoutStore = defineStore('layout', () => {
  const isRouterAlive = ref(true);
  const showLayout = ref(false);
  const showMode = ref(false);
  const systemTheme = ref<Theme>(Theme.Light);
  function setShowLayout(type: boolean) {
    showLayout.value = type;
  }
  const reload = () => {
    isRouterAlive.value = false;
    nextTick(() => {
      isRouterAlive.value = true;
    });
  };

  const setTheme = (theme: Theme) => {
    systemTheme.value = theme;
  };

  return { showLayout, setShowLayout, showMode, isRouterAlive, reload, systemTheme, setTheme };
});
