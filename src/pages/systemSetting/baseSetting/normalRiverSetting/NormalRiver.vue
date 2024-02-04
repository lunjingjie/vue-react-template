<template>
  <div class="condition-wrap">
    <a-row style="line-height: 32px; box-sizing: border-box">
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span>河涌名称:</span>
        <a-input
          style="width: 250px; margin-left: 10px"
          v-model:value="fieldValue.riverName"
          allow-clear
        />
      </div>
      <CBtn :showType="BTN_TYPE.search" class="mx-2" @click="search"></CBtn>
      <CBtn :showType="BTN_TYPE.add" @click="addItems"></CBtn>
    </a-row>
  </div>
  <div class="condition-wrap">
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
          <CBtn :showType="BTN_TYPE.delete" @click="deleteItem(record.riverId)"></CBtn>
        </template>
        <template v-else-if="column.dataIndex === 'basinId'">
          {{ getValueByOptions(record[column.dataIndex], basinRiverOptions) }}
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
      <NormalRiverEdit
        ref="editElement"
        :editInfo="editInfo"
        :basinRiverOptions="basinRiverOptions"
      ></NormalRiverEdit>
    </EditModel>
  </div>
</template>
<script setup>
  import { ref, reactive, computed } from 'vue';
  import {
    getRiverByPageApi,
    saveRiverApi,
    deleteRiverApi,
    updateRiverApi,
  } from '@/api/systemSetting/baseSetting/normalRiverSetting';
  import { tableHeaders } from './headers';
  import NormalRiverEdit from './NormalRiverEdit.vue';
  import { message as Message } from 'ant-design-vue';
  import { showDeleteConfirm } from '@/utils/model';
  import { deepClone, getValueByOptions } from '@/utils';
  import { useBasinRiverStore } from '@/stores/basinRiver';
  import { useNormalRiverStore } from '@/stores/normalRiver';
  import { useInitTable } from '@/hooks/web/useInitTable';

  const store = useBasinRiverStore();
  const normalRiverStore = useNormalRiverStore();
  const basinRiverOptions = computed(() => {
    return store.basinRiverOptions;
  });

  const visible = ref(false);

  const fieldValue = reactive({
    riverName: '',
  });

  const { current, size, total, dataSource, offsetHeight, search, getListByPage } = useInitTable(
    fieldValue,
    getRiverByPageApi,
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
          res = await saveRiverApi(editElement.value.formState);
        } else {
          res = await updateRiverApi(editElement.value.formState);
        }
        if (res.data.code === 200) {
          confirmLoading.value = false;
          getListByPage();
          Message.success(res.data.msg);
          visible.value = false;
          normalRiverStore.getAllNormalRiver();
        }
      }
    } catch (err) {
      console.log(err);
      confirmLoading.value = false;
    }
  };

  const deleteItem = (id) => {
    showDeleteConfirm({
      successCb: async () => {
        await deleteRiverApi(id);
        getListByPage();
        normalRiverStore.getAllNormalRiver();
      },
    });
  };
</script>
<style scoped lang="scss">
  .condition-wrap {
    padding: 12px 10px 2px;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 2px;
  }
</style>
