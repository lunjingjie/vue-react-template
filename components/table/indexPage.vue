<template>
  <div
    class="table_body"
    :class="props.hasClass ? '' : 'system_ui_card'"
    :style="{ height: props.offsetHeight + 'px' }"
  >
    <a-spin :spinning="props.spinning" tip="数据加载中...">
      <a-table
        style="width: 100%"
        size="middle"
        :style="{ height: props.offsetHeight - 60 + 'px' }"
        :columns="props.columns"
        :data-source="props.tableData"
        bordered
        :pagination="false"
        :scroll="{ y: props.offsetHeight - 130 }"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.type === 'isConvert'">
            {{ column.data.get(record[column.dataIndex]) || '--' }}
          </template>
          <template v-if="column.type === 'tag'">
            <a-tag size="small" color="#ff0000" v-if="record[column.dataIndex]">{{
              record[column.dataIndex]
            }}</a-tag>
          </template>
          <template v-if="column.type === 'hasMethod'">
            {{ column.method(record[column.dataIndex]) || '--' }}
          </template>
          <template v-if="column.type === 'limitValue'">
            {{ getLimitValueText(record[column.dataIndex]) }}
          </template>
          <template v-if="column.type === 'transfer'">
            {{ geTtransferText(column.dataIndex, record[column.dataIndex]) }}
          </template>
          <template v-if="column.type === 'fromDictData'">
            {{ getFromDictData(column.dataIndex, record[column.dataIndex]) }}
          </template>
          <template v-if="column.type === 'icon'">
            <Icon
              v-if="record[column.dataIndex]"
              :icon="record[column.dataIndex]"
              color="#333"
            ></Icon>
            <span v-else>{{ '--' }}</span>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <div style="display: flex; justify-content: center">
              <div v-for="(item, index) in column.type" :key="index">
                <CBtn
                  v-if="item === 'edit'"
                  :showType="BTN_TYPE.edit"
                  @click="editData(record)"
                ></CBtn>

                <CBtn
                  v-if="item === 'configure'"
                  :showType="BTN_TYPE.configure"
                  @click="setData(record)"
                ></CBtn>
                <CBtn
                  v-if="item === 'addrole'"
                  :showType="BTN_TYPE.addrole"
                  @click="setData(record)"
                ></CBtn>
                <CBtn
                  v-if="item === 'addKey'"
                  :showType="BTN_TYPE.addKey"
                  @click="setData(record)"
                ></CBtn>
                <CBtn
                  v-if="item === 'addmenu'"
                  :showType="BTN_TYPE.addmenu"
                  @click="setData(record)"
                ></CBtn>
                <CBtn
                  v-if="item === 'permit'"
                  :showType="BTN_TYPE.permit"
                  @click="permitData(record)"
                ></CBtn>
                <CBtn
                  v-if="item === 'eia'"
                  :showType="BTN_TYPE.eia"
                  @click="eiaData(record)"
                ></CBtn>

                <CBtn
                  v-if="record.sbr === '未处理'"
                  :showType="BTN_TYPE.alarm"
                  @click="alarmData(record)"
                ></CBtn>
                <CBtn
                  v-if="record.sbr === '待审核'"
                  :showType="BTN_TYPE.audit"
                  @click="setData(record)"
                ></CBtn>

                <a-popconfirm title="是否删除?" @confirm="delData(record)" v-if="item === 'delete'">
                  <CBtn :showType="BTN_TYPE.delete"></CBtn>
                </a-popconfirm>
              </div>
            </div>
          </template>
          <template v-else-if="!column.type && !column.customRender">{{
            record[column.dataIndex] || '--'
          }}</template>
        </template>
      </a-table>
      <div style="display: flex; flex-direction: row; justify-content: end">
        <a-pagination
          style="margin-bottom: 10px"
          size="small"
          :total="total"
          v-model:current="current"
          v-model:pageSize="pageSize"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
        />
      </div>
    </a-spin>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({
    offsetWidth: Number,
    offsetHeight: Number,
    spinning: Boolean,
    columns: Object,
    tableData: Object,
    tableDictData: Object,
    total: Number,
    current: Number,
    pageSize: Number,
    hasClass: Boolean,
  });
  const current = ref(props.current);
  const pageSize = ref(props.pageSize);

  watch(current, (val) => {
    emits('initData', { current: val, pageSize: pageSize.value });
  });
  watch(pageSize, (val) => {
    emits('initData', { current: current.value, pageSize: val });
  });

  watch(
    () => props.current,
    (newVal) => {
      current.value = newVal;
    },
    { deep: true },
  );

  //   //编辑
  const editData = (val) => {
    emits('editData', val);
  };
  //   //删除
  const delData = (val) => {
    emits('delData', val);
  };

  const emits = defineEmits([
    'editData',
    'delData',
    'permitData',
    'eiaData',
    'setData',
    'alarmData',
  ]);
  const permitData = (val) => {
    emits('permitData', val);
  };
  const eiaData = (val) => {
    emits('eiaData', val);
  };
  const setData = (val) => {
    emits('setData', val);
  };
  const alarmData = (val) => {
    emits('alarmData', val);
  };
  const getLimitValueText = (val) => {
    let text = '无';
    if (val !== 9999 && val !== -9999 && val !== '9999' && val !== '-9999' && val != null) {
      text = val;
    }
    return text;
  };
  const geTtransferText = (key, val) => {
    let text = '--';
    if (props.tableDictData[key]) {
      props.tableDictData[key].forEach((item) => {
        if (val == item.dictValue) {
          text = item.dictLabel;
        }
      });
    }
    return text;
  };

  const getFromDictData = (key, val) => {
    let text = '--';
    if (props.tableDictData[key]) {
      props.tableDictData[key].forEach((item) => {
        if (val == item.value) {
          text = item.label;
        }
      });
    }
    return text;
  };
</script>

<style scoped>
  .table_body {
    margin-top: 12px;
    width: 100%;
  }
</style>
