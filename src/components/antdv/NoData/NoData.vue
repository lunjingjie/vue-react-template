<template>
  <a-empty :image="simpleImage" :description="text" />
</template>
<script>
  import { defineComponent } from 'vue';
  import { Empty } from 'ant-design-vue';
  export default defineComponent({
    props: {
      text: {
        type: String,
        default: '暂无数据',
      },
    },
    setup() {
      return {
        simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      };
    },
  });
</script>
