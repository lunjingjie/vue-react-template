import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getBasinByPageApi } from '@/api/systemSetting/baseSetting/basinRiverSetting';

export const useBasinRiverStore = defineStore('basinRiver', () => {
  const basinRiverOptions = ref([]);

  const getAllBasinRiver = async () => {
    const { data } = await getBasinByPageApi({ current: 1, size: 100 });
    basinRiverOptions.value = data.data.records.map((item) => ({
      label: item.basinName,
      value: item.basinId,
    }));
  };

  return { basinRiverOptions, getAllBasinRiver };
});
