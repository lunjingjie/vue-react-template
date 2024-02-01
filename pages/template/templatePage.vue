<template>
  <div>
    <a-card title="主要版本" size="small" class="my-3">
      <div>
        <a-tag class="ml-2">vue：^3.2.45</a-tag> <a-tag class="ml-2">ant-design-vue：^4.1.0</a-tag>
        <a-tag class="ml-2">vite：^3.2.4</a-tag>
      </div>
    </a-card>
    <a-card title="基础控件" size="small" class="my-3">
      <a-space>
        <CSelect :options="options" v-model:value="select"></CSelect>
        <CInput v-model:value="value"></CInput>
        {{ count }} <a-button type="primary" @click="add">add</a-button>
      </a-space>
    </a-card>
    <div class="my-3">
      <a-badge-ribbon text="常规按钮">
        <a-card title="常规按钮" size="small">
          <a-space>
            <CBtn :showType="BTN_TYPE.search"></CBtn>
            <CBtn :showType="BTN_TYPE.reset"></CBtn>
            <CBtn :showType="BTN_TYPE.add">新增</CBtn>
            <CBtn :showType="BTN_TYPE.upload">导入</CBtn>
            <CBtn :showType="BTN_TYPE.download">导出</CBtn>
            <CBtn :showType="BTN_TYPE.close">关闭</CBtn>
          </a-space>
        </a-card>
      </a-badge-ribbon>
    </div>
    <div class="my-3">
      <a-badge-ribbon text="删除确认提示框">
        <a-card title="删除确认提示框" size="small">
          <CBtn :showType="BTN_TYPE.delete" class="mx-1" @click="del">删除</CBtn>
        </a-card>
      </a-badge-ribbon>
    </div>
    <div class="my-3">
      <a-badge-ribbon text="日历控件(含有农历和节假日)">
        <a-card title="日历控件(含有农历和节假日)" size="small">
          <CCalendar v-model:value="beginTime"></CCalendar>
        </a-card>
      </a-badge-ribbon>
    </div>
    <div class="my-3">
      <a-badge-ribbon text="用于表格操作">
        <a-card title="表格按钮" size="small">
          <CBtn :showType="BTN_TYPE.edit" class="mx-1">编辑</CBtn>
          <CBtn :showType="BTN_TYPE.delete" class="mx-1">删除</CBtn>
        </a-card>
      </a-badge-ribbon>
    </div>
  </div>
</template>
<script setup lang="ts">
  import CSelect from '@/components/antdv/Select/src/BasicSelect.vue';
  import CInput from '@/components/antdv/Input/BasicInput.vue';
  import CBtn from '@/components/antdv/Button/BasicBtn.vue';
  import CCalendar from '@/components/antdv/calendar/calendarPage.vue';
  import { BTN_TYPE } from '@/constants';
  import { ref, watch, createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Modal } from 'ant-design-vue';
  import { message } from 'ant-design-vue';

  const options = ref([
    {
      label: 'test',
      value: 'test',
    },
  ]);
  const select = ref('');
  const count = ref(0);
  const value = ref('');
  const beginTime = ref(null);

  const add = () => {
    count.value = count.value + 1;
  };

  watch(select, (val) => {
    console.log(val);
  });

  const del = () => {
    Modal.confirm({
      title: () => '提示',
      icon: () => createVNode(ExclamationCircleOutlined),
      content: () => createVNode('div', { style: 'color:block;' }, `确定删除该条数据?`),
      onOk: async () => {
        message.success('删除成功!');
      },
    });
  };

  const add1 = (a: number, b: number): number => {
    return a + b;
  };

  const a = add1('1', 2);
  console.log(a, typeof a);
</script>
