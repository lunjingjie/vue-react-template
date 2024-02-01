<template>
  <a-modal v-bind="attrs" :title="title" okText="保存" @cancel="handleCancel">
    <slot></slot>
  </a-modal>
</template>
<script>
  export default {
    name: 'EditModel',
    inheritAttrs: false,
  };
</script>
<script setup name="EditModel">
  // import { ref } from 'vue';
  import { useAttrs } from 'vue';
  // import { message } from 'ant-design-vue';

  const emits = defineEmits(['update:visible']);
  defineProps({
    title: {
      type: String,
      default: '编辑',
    },
    // saveCallback: {
    //   type: Function,
    //   default: () => {},
    // },
  });

  const attrs = useAttrs();
  // const confirmLoading = ref(false);

  // const handleOk = async () => {
  //   if (!props.saveCallback) {
  //     return;
  //   }
  //   // TODO 具体处理逻辑需要与接口对接
  //   try {
  //     confirmLoading.value = true;
  //     await props.saveCallback();
  //     emits('update:visible', false);
  //     confirmLoading.value = false;
  //     message.success('保存成功!');
  //   } catch (error) {
  //     console.error(error);
  //     message.error('保存失败!');
  //   }
  // };

  const handleCancel = () => {
    emits('update:visible', false);
  };
</script>
