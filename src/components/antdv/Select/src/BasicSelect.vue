<template>
  <a-select
    :options="options"
    show-search
    placeholder="类型选择"
    allow-clear
    style="width: 200px"
    :filterOption="filterOption"
    v-bind="attrs"
  >
  </a-select>
</template>
<script>
  export default {
    name: 'MySelect',
    inheritAttrs: false,
  };
</script>
<script setup name="CSelect">
  import { useAttrs } from 'vue';

  const attrs = useAttrs();
  defineProps({
    options: {
      type: Array,
      default: () => [],
    },
  });

  const filterOption = (input, option) => {
    return option.label.indexOf(input) >= 0;
  };
</script>
