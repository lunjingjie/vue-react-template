<template>
  <a-tooltip :title="getTitle" placement="bottom">
    <span @click="toggle">
      <Icon
        style="position: relative; top: 4px"
        icon="material-symbols:fullscreen-rounded"
        :size="24"
        v-if="!isFullscreen"
        color="#606266"
      />
      <Icon
        style="position: relative; top: 4px"
        icon="material-symbols:fullscreen-exit-rounded"
        :size="24"
        color="#606266"
        v-else
      />
    </span>
  </a-tooltip>
</template>
<script setup name="FullScreen">
  import { useFullscreen } from '@vueuse/core';
  import { computed, unref } from 'vue';

  const { toggle, isFullscreen } = useFullscreen();

  const getTitle = computed(() => {
    return unref(isFullscreen) ? '退出全屏' : '全屏';
  });
</script>
