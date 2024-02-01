import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  // 全局选择事件信息
  const eventInfo = ref(null);

  const setEventInfo = (info) => {
    eventInfo.value = info;
  };

  return {
    eventInfo,
    setEventInfo,
  };
});
