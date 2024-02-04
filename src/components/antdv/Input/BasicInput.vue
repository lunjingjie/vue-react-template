<template>
  <a-input
    placeholder="请输入"
    allow-clear
    :style="{ width: innerWidth !== undefined ? innerWidth : '200px' }"
    v-bind="attrs"
  />
</template>
<script>
  export default {
    name: 'inputName',
    inheritAttrs: false,
  };
</script>
<script setup name="CSelect">
  import { useAttrs } from 'vue';
  const attrs = useAttrs();
  defineProps({
    innerWidth: {
      type: String,
    },
  });
</script>
