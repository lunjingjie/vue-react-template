<template>
  <a-card size="small">
    <a-row style="line-height: 32px; box-sizing: border-box">
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span>流域名称:</span>
        <a-input
          style="width: 250px; margin-left: 10px"
          v-model:value="fieldValue.basinName"
          allow-clear
        />
      </div>
      <CBtn :showType="BTN_TYPE.search" class="mx-2" @click="search"></CBtn>
      <CBtn :showType="BTN_TYPE.add" @click="addItems"></CBtn>
    </a-row>
  </a-card>
  <a-card size="small" class="mt-2">
    <a-table
      :columns="tableHeaders"
      :data-source="dataSource"
      bordered
      size="middle"
      :pagination="false"
      :style="{ height: offsetHeight + 60 + 'px' }"
      :scroll="{ y: offsetHeight }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <CBtn :showType="BTN_TYPE.edit" @click="editItem(record)"></CBtn>
          <CBtn :showType="BTN_TYPE.delete" @click="deleteItem(record.basinId)"></CBtn>
        </template>
        <template v-else>
          <span>{{
            record[column.dataIndex] === null || record[column.dataIndex] === ''
              ? '--'
              : record[column.dataIndex]
          }}</span>
        </template>
      </template>
    </a-table>
    <div style="display: flex; flex-direction: row; justify-content: end">
      <a-pagination
        style="margin-bottom: 10px"
        size="small"
        :total="total"
        v-model:current="current"
        v-model:pageSize="size"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      />
    </div>
    <EditModel
      v-model:visible="visible"
      :width="620"
      @ok="saveFunc"
      :title="isAdd ? '新增' : '编辑'"
      :confirm-loading="confirmLoading"
    >
      <BasinRiverEdit ref="editElement" :editInfo="editInfo"></BasinRiverEdit>
    </EditModel>
  </a-card>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  import {
    getBasinByPageApi,
    saveBasinApi,
    deleteBasinApi,
    updateBasinApi,
  } from '@/api/systemSetting/baseSetting/basinRiverSetting';
  import { tableHeaders } from './headers';
  import BasinRiverEdit from './BasinRiverEdit.vue';
  import { message as Message } from 'ant-design-vue';
  import { showDeleteConfirm } from '@/utils/model';
  import { deepClone } from '@/utils';
  import { useBasinRiverStore } from '@/stores/basinRiver';
  import { useInitTable } from '@/hooks/web/useInitTable';

  const { getAllBasinRiver } = useBasinRiverStore();

  const visible = ref(false);

  const fieldValue = reactive({
    basinName: '',
  });

  const { current, size, total, dataSource, offsetHeight, search, getListByPage } = useInitTable(
    fieldValue,
    getBasinByPageApi,
  );

  const editInfo = ref({});
  const editElement = ref(null);
  const confirmLoading = ref(false);
  const isAdd = ref(true);
  // 点击新增
  const addItems = () => {
    isAdd.value = true;
    editInfo.value = {};
    visible.value = true;
  };
  // 点击编辑
  const editItem = (record) => {
    isAdd.value = false;
    editInfo.value = deepClone(record);
    visible.value = true;
  };
  // 保存操作
  const saveFunc = async () => {
    try {
      const flag = await editElement.value.validateForm();
      if (flag) {
        confirmLoading.value = true;
        let res = null;
        if (isAdd.value) {
          res = await saveBasinApi(editElement.value.formState);
        } else {
          res = await updateBasinApi(editElement.value.formState);
        }
        if (res.data.code === 200) {
          confirmLoading.value = false;
          getListByPage();
          Message.success(res.data.msg);
          visible.value = false;
          getAllBasinRiver();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = (id) => {
    showDeleteConfirm({
      successCb: async () => {
        await deleteBasinApi(id);
        getListByPage();
        getAllBasinRiver();
      },
    });
  };
</script>
