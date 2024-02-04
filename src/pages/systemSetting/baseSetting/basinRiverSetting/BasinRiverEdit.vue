<template>
  <div>
    <a-form
      :model="formState"
      ref="formRef"
      name="basic"
      :label-col="{
        style: {
          width: '150px',
        },
      }"
      autocomplete="off"
    >
      <a-form-item
        v-for="header in editHeaders"
        :key="header.dataIndex"
        :label="header.title"
        :name="header.dataIndex"
        :rules="{ required: header.required, message: `请输入${header.title}` }"
      >
        <a-input style="width: 400px" v-model:value="formState[header.dataIndex]" allow-clear />
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
  import { editHeaders } from './headers';
  import { ref, onMounted, watch, reactive } from 'vue';

  const props = defineProps({
    editInfo: Object,
  });

  const formState = reactive({});
  const formRef = ref(null);

  const validateForm = async () => {
    try {
      await formRef.value.validateFields();
      return true;
    } catch (errorInfo) {
      return false;
    }
  };

  watch(
    () => props.editInfo,
    () => {
      if (JSON.stringify(props.editInfo) === '{}') {
        formState.value = {};
        editHeaders.forEach((item) => {
          formState[item.dataIndex] = null;
        });
      } else {
        formatItems();
      }
    },
  );

  const formatItems = () => {
    Object.keys(props.editInfo).forEach((key) => {
      formState[key] = props.editInfo[key];
    });
    // editHeaders.forEach((item) => {
    //   formState.value[item.dataIndex] = props.editInfo[item.dataIndex];
    // });
  };

  onMounted(() => {
    if (JSON.stringify(props.editInfo) === '{}') {
      formState.value = {};
      editHeaders.forEach((item) => {
        formState[item.dataIndex] = null;
      });
    } else {
      formatItems();
    }
  });

  defineExpose({
    formState,
    validateForm,
  });
</script>
