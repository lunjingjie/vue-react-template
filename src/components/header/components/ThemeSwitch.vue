<template>
  <div>
    <a-switch
      v-model:checked="switchFlag"
      @change="changeTheme"
      style="position: relative; top: -2px"
    >
      <template #checkedChildren>
        <Icon icon="mdi-weather-night" size="20" color="#fff" />
      </template>
      <template #unCheckedChildren>
        <Icon icon="mdi-weather-sunny" size="20" color="#fff" />
      </template>
    </a-switch>
  </div>
</template>
<script setup name="ThemeSwitch">
  import { ref } from 'vue';
  import { useLayoutStore } from '@/stores/layout';

  const { setTheme } = useLayoutStore();
  const switchFlag = ref(false);

  const changeTheme = (checked) => {
    if (checked) {
      setTheme('dark');
      document.documentElement.setAttribute('theme', 'dark');
      return;
    }
    setTheme('light');
    document.documentElement.setAttribute('theme', 'light');
  };
</script>
