<template>
  <div>
    <div>
      <search-index
        :searchData="searchData"
        title="字典管理"
        :isAdd="true"
        @seek-data="seekData"
        @add-data="addData"
      />
    </div>
    <tableIndex
      :offsetHeight="offsetHeight"
      :spinning="spinning"
      :columns="columns"
      :tableData="tableData"
      :total="total"
      v-model:current="current"
      v-model:pageSize="pageSize"
      :tableDictData="tableDictData"
      @editData="editData"
      @delData="delData"
      @init-data="initData"
    ></tableIndex>
    <a-modal v-model:visible="showModel" width="1050px" :title="showEdit ? '编辑编码' : '新增编码'">
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" @click="saveDictData">保存</a-button>
      </template>
      <div style="margin: 0px 30px">
        <a-form :model="addForm">
          <div class="a_flex">
            <div class="form_box">
              <a-form-item label="参数类型编码*" labelAlign="right">
                <a-input v-model:value="addForm.paraCode" class="form_item_box" />
              </a-form-item>
              <a-form-item label="参数类型名称*" labelAlign="right">
                <a-input v-model:value="addForm.paraName" class="form_item_box" />
              </a-form-item>

              <a-form-item label="告警上限值" labelAlign="right">
                <a-input v-model:value="addForm.upperLimit" class="form_item_box" />
              </a-form-item>
              <a-form-item label="告警下限值" labelAlign="right">
                <a-input v-model:value="addForm.lowerLimit" class="form_item_box" />
              </a-form-item>
              <a-form-item label="量程上限值" labelAlign="right">
                <a-input v-model:value="addForm.upperRange" class="form_item_box" />
              </a-form-item>
              <a-form-item label="量程下限值" labelAlign="right">
                <a-input v-model:value="addForm.lowerRange" class="form_item_box" />
              </a-form-item>
            </div>
            <div class="form_box ml-2">
              <a-form-item label="所属规范" labelAlign="right">
                <!-- <a-input v-model:value="addForm.paraStandard" class="form_item_box" /> -->
                <a-select
                  v-model:value="addForm.paraStandard"
                  placeholder="所属规范"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option
                    v-for="(item, i) in paraStandardOption"
                    :key="i"
                    :value="item.dictValue"
                  >
                    {{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="参数单位" labelAlign="right">
                <a-input v-model:value="addForm.paraUnit" class="form_item_box" />
              </a-form-item>
              <a-form-item label="统计单位" labelAlign="right">
                <a-input v-model:value="addForm.statsUnit" class="form_item_box" />
              </a-form-item>
              <!-- <a-form-item label="是否开关量" labelAlign="right">
                <a-input v-model:value="addForm.isSwitch" class="form_item_box" />
                <a-select
                  v-model:value="addForm.isSwitch"
                  placeholder="是否开关量"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option v-for="(item, i) in isParamOption" :key="i" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="是否累积量" labelAlign="right">
                <a-input v-model:value="addForm.isAccumulate" class="form_item_box" />
                <a-select
                  v-model:value="addForm.isAccumulate"
                  placeholder="是否累积量"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option v-for="(item, i) in isParamOption" :key="i" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item> -->
              <a-form-item label="流程分类" labelAlign="right">
                <!-- <a-input v-model:value="addForm.processType" class="form_item_box" /> -->
                <a-select
                  v-model:value="addForm.processType"
                  placeholder="流程分类"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option
                    v-for="(item, i) in processTypeOption"
                    :key="i"
                    :value="item.dictValue"
                  >
                    {{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="传感器编码生成策略" labelAlign="right">
                <!-- <a-input v-model:value="addForm.genStrategy" class="form_item_box" /> -->
                <a-select
                  v-model:value="addForm.genStrategy"
                  placeholder="传感器编码生成策略"
                  allowClear
                  show-search
                  class="search_input form_item_box"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                  <a-select-option
                    v-for="(item, i) in genStrategyOption"
                    :key="i"
                    :value="parseInt(item.dictValue)"
                  >
                    {{ item.dictLabel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <!-- <a-form-item label="展示顺序" labelAlign="right">
                <a-input v-model:value="addForm.sequence" class="form_item_box" />
              </a-form-item> -->
              <a-form-item label="备注" labelAlign="right" style="padding-left: 128px">
                <a-input v-model:value="addForm.remarks" class="form_item_box" />
              </a-form-item>
            </div>
          </div>
          <!-- <a-form-item label="备注" labelAlign="right" style="padding-left: 128px">
            <a-input v-model:value="addForm.remarks" class="form_item_box" />
          </a-form-item> -->
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import searchIndex from '@/components/system-search/search-index.vue';
  import tableIndex from '@/components/table/indexPage.vue';
  import {
    getCodeListData,
    addCodeData,
    editCodeData,
    delCodeData,
    getDictData,
  } from '@/api/systemSetting/systemManage/code.js';

  const searchData = ref({
    name: {
      name: '参数名称',
      value: '',
      placeholder: '请输入参数名称',
      type: 'input',
    },
    code: {
      name: '参数编码',
      value: '',
      placeholder: '请输入参数编码',
      type: 'input',
    },
  });

  const offsetHeight = ref(document.body.offsetHeight - 202);
  // const isParamOption = ref([
  //   { label: '是', value: 'Y' },
  //   { label: '否', value: 'N' },
  // ]);
  const genStrategyOption = ref([]);
  const processTypeOption = ref([]);
  const paraStandardOption = ref([]);
  const tableDictData = ref({});

  const columns = ref([
    { title: '参数类型名称', dataIndex: 'paraName', align: 'center' },
    { title: '参数类型编码', dataIndex: 'paraCode', align: 'center' },
    { title: '参数单位', dataIndex: 'paraUnit', align: 'center' },
    { title: '统计单位', dataIndex: 'statsUnit', align: 'center' },
    { title: '传感器编码生成策略', dataIndex: 'genStrategy', align: 'center', type: 'transfer' },
    { title: '流程分类', dataIndex: 'processType', align: 'center', type: 'transfer' },
    { title: '告警上限值', dataIndex: 'upperLimit', align: 'center', type: 'limitValue' },
    { title: '告警下限值', dataIndex: 'lowerLimit', align: 'center', type: 'limitValue' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      type: ['edit', 'delete'],
      fixed: 'right',
    },
  ]);
  const tableData = ref([]);
  const showModel = ref(false);
  const addForm = ref({});
  const saveDictData = async () => {
    if (addForm.value.paraCode == '') {
      message.error('参数类型名称不能为空');
    } else if (addForm.value.paraName == '') {
      message.error('参数类型编码不能为空');
    } else {
      let param = { ...addForm.value };
      param.upperLimit = addForm.value.upperLimit === '' ? 9999 : addForm.value.upperLimit;
      param.lowerLimit = addForm.value.lowerLimit === '' ? -9999 : addForm.value.lowerLimit;
      param.upperRange = addForm.value.upperRange === '' ? 9999 : addForm.value.upperRange;
      param.lowerRange = addForm.value.lowerRange === '' ? -9999 : addForm.value.lowerRange;
      if (!showEdit.value) {
        const { data } = await addCodeData(param);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          getCodeList();
        } else {
          message.error('保存失败，请检查');
        }
      } else {
        const { data } = await editCodeData(param);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          getCodeList();
        } else {
          message.error('保存失败，请检查');
        }
      }
    }
  };

  const seekData = () => {
    if (current.value === 1) {
      getCodeList();
    } else {
      current.value = 1;
    }
  };
  const initData = (val) => {
    current.value = val.current;
    pageSize.value = val.pageSize;
  };
  const addData = () => {
    showModel.value = true;
    addForm.value = {
      paraUnit: '',
      paraStandard: '',
      isAccumulate: '',
      lowerLimit: '',
      genStrategy: '',
      paraName: '',
      paraCode: '',
      statsUnit: '',
      isSwitch: '',
      upperLimit: '',
      processType: '',
      upperRange: '',
      lowerRange: '',
      remarks: '',
    };
  };

  const addValue = ref(false);

  const showEdit = ref(false);
  const editData = (val) => {
    showModel.value = true;
    showEdit.value = true;
    addForm.value = val;
    // addForm.value.upperLimit = val.upperLimit == 9999 ? '' : val.upperLimit;
    // addForm.value.lowerLimit = val.lowerLimit == -9999 ? '' : val.lowerLimit;
    // addForm.value.upperRange = val.upperRange == 9999 ? '' : val.upperRange;
    // addForm.value.lowerRange = val.lowerRange == -9999 ? '' : val.lowerRange;
  };
  watch(showModel, () => {
    if (!showModel.value) {
      showEdit.value = false;
      addValue.value = true;
    }
  });
  const delData = async (val) => {
    const { data } = await delCodeData(val.paraId);
    if (data.code === 200) {
      message.success('删除成功');
      getCodeList();
    }
  };
  const current = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  watch(pageSize, () => {
    getCodeList();
  });
  watch(current, () => {
    getCodeList();
  });
  onMounted(() => {
    getCodeList();
    getDict();
  });
  const spinning = ref(false);
  const getCodeList = async () => {
    spinning.value = true;
    const { data } = await getCodeListData(
      current.value,
      pageSize.value,
      searchData.value.name.value,
      searchData.value.code.value,
    );
    tableData.value = data.data.records;
    total.value = data.data.total;
    spinning.value = false;
  };
  const getDict = async () => {
    const { data: genStrategy } = await getDictData('gen_strategy');
    genStrategyOption.value = genStrategy.data.records;
    tableDictData.value.genStrategy = genStrategy.data.records;
    const { data: processType } = await getDictData('process_type');
    processTypeOption.value = processType.data.records;
    tableDictData.value.processType = processType.data.records;
    const { data: paraStandard } = await getDictData('param_standard');
    paraStandardOption.value = paraStandard.data.records;
  };
</script>
<style scoped>
  .dict_body {
    margin-top: 12px;
    width: 100%;
  }
  .form_item_box {
    width: 250px;
  }
  .form_box {
    width: 420px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
</style>
