<template>
  <div class="condition-wrap">
    <a-row style="line-height: 32px; box-sizing: border-box">
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span class="search-label">操作方法类型:</span>
        <CSelect
          :options="operationTypeList"
          v-model:value="fieldValue.methodType"
          placeholder="操作方法类型"
        ></CSelect>
      </div>
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span class="search-label">结果:</span>
        <CSelect
          :options="resultList"
          v-model:value="fieldValue.logResult"
          placeholder="结果"
        ></CSelect>
      </div>
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span>开始时间:</span>
        <a-date-picker
          :locale="locale"
          style="margin-left: 10px"
          v-model:value="fieldValue.beginTime"
          value-format="YYYY-MM-DD 00:00:00"
        />
      </div>
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span>结束时间:</span>
        <a-date-picker
          :locale="locale"
          style="margin-left: 10px"
          v-model:value="fieldValue.endTime"
          value-format="YYYY-MM-DD 23:59:59"
        />
      </div>
      <CBtn :showType="BTN_TYPE.search" class="mx-2" @click="search"></CBtn>
    </a-row>
  </div>
  <div class="condition-wrap">
    <a-table
      :columns="headers"
      :data-source="dataSource"
      bordered
      size="middle"
      :pagination="false"
      :style="{ height: offsetHeight + 60 + 'px' }"
      :scroll="{ y: offsetHeight - 15 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'logType'">
          <span>{{ record[column.dataIndex] === '0' ? '系统用户操作日志' : '其他日志' }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'logInfo'">
          <a-button
            v-if="record[column.dataIndex]"
            type="text"
            style="color: var(--custom-primary-color)"
            @click="showInfo(record[column.dataIndex])"
            >详情</a-button
          >
          <span v-else>--</span>
        </template>
        <template v-else>
          <span>{{ record[column.dataIndex] === null ? '--' : record[column.dataIndex] }}</span>
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
    <a-modal v-model:visible="visible" title="日志详情" style="width: 600px">
      <span>{{ currentInfoText }}</span>
    </a-modal>
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue';
  import dayjs from 'dayjs';
  import {
    getOperationLogListApi,
    getOperationTypeListApi,
  } from '@/api/systemSetting/systemManage/trackLog';
  import { headers } from './headers';
  import { useInitTable } from '@/hooks/web/useInitTable';
  import { useDict } from '@/hooks/web/useDict';

  const fieldValue = reactive({
    beginTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
    endTime: dayjs().format('YYYY-MM-DD 23:59:59'),
    logResult: '',
    methodType: '',
  });

  const visible = ref(false);
  const currentInfoText = ref(false);
  const operationTypeList = ref([]);
  const resultList = ref([]);

  const showInfo = (detail) => {
    currentInfoText.value = detail;
    visible.value = true;
  };

  const getOperationTypeList = async () => {
    const { data } = await getOperationTypeListApi();
    operationTypeList.value =
      data.data.map((item) => ({
        label: item,
        value: item,
      })) || [];
  };

  const onMountedAfterCheckFunc = async () => {
    await getOperationTypeList();
    resultList.value = await useDict('log_result');
  };

  const { current, size, total, dataSource, offsetHeight, search } = useInitTable(
    fieldValue,
    getOperationLogListApi,
    {
      onMountedAfterCheckFunc,
    },
  );
</script>
