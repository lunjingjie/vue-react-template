<template>
  <div>
    <search-index
      :searchData="searchData"
      :isAdd="true"
      @seek-data="seekData"
      @add-data="addData"
    />
    <div class="dict_body system_ui_card" :style="{ height: offsetHeight + 55 + 'px' }">
      <a-space>
        <a-button type="primary" @click="confiMenu()">菜单配置</a-button>
        <a-button type="primary" @click="confiMon()">模板配置</a-button>
      </a-space>

      <a-spin :spinning="spinning" tip="数据加载中...">
        <div style="margin-top: 8px">
          <a-table
            style="width: 100%"
            size="small"
            :style="{ height: offsetHeight - 60 + 'px' }"
            :columns="columns"
            :data-source="tableData"
            :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            :rowKey="(record) => record.tenantId"
            bordered
            :pagination="false"
            :scroll="{ y: offsetHeight - 115 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'tenantStatus'">
                {{ record.tenantStatus === '0' ? '正常' : '停用' }}
              </template>
              <template v-if="column.dataIndex === 'action'">
                <div style="display: flex; justify-content: center">
                  <CBtn :showType="BTN_TYPE.edit" @click="editData(record)"></CBtn>
                  <a-popconfirm title="是否删除?" @confirm="delData(record)">
                    <CBtn :showType="BTN_TYPE.delete"></CBtn>
                  </a-popconfirm>
                </div>
              </template>
              <template v-else-if="column.dataIndex !== 'tenantStatus'">{{
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
              v-model:pageSize="size"
              show-size-changer
              show-quick-jumper
              :show-total="(total) => `共 ${total} 条`"
            />
          </div>
        </div>
      </a-spin>
    </div>
    <a-modal v-model:visible="showModel" width="650px" :title="showEdit ? '编辑租户' : '新增租户'">
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" v-if="showEdit" @click="editUserData">保存</a-button>
        <a-button type="primary" v-else-if="!showEdit" @click="saveTenantData">新增</a-button>
      </template>
      <div style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column">
        <a-form :model="addForm" :labelCol="{ span: 6 }" ref="formRef">
          <a-form-item
            label="名称"
            labelAlign="right"
            name="tenantName"
            :disabled="showEdit"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="addForm.tenantName" :disabled="showEdit" style="width: 400px" />
          </a-form-item>
          <a-form :model="loginForm" :labelCol="{ span: 6 }" ref="loginRef">
            <a-form-item
              label="租户管理账号"
              labelAlign="right"
              name="loginName"
              :rules="[{ required: true }]"
            >
              <a-input
                v-model:value="loginForm.loginName"
                :disabled="showEdit"
                style="width: 400px"
              />
            </a-form-item>
            <a-form-item
              label="租户管理密码"
              labelAlign="right"
              name="password"
              :rules="[{ required: !showEdit }]"
            >
              <a-input-password
                v-model:value="loginForm.password"
                :placeholder="!showEdit ? '' : '输入框为空时则不更新密码'"
                style="width: 400px"
              />
            </a-form-item>
          </a-form>
          <a-form-item label="所属区域" labelAlign="right">
            <AreaSelect
              ref="areaTreeRef"
              v-model:value="addForm.areaId"
              placeholder="区域选择"
              style="width: 400px; margin-left: 0"
            ></AreaSelect>
          </a-form-item>
          <a-form-item label="备注" labelAlign="right">
            <a-input v-model:value="addForm.remarks" style="width: 400px" />
          </a-form-item>
          <a-form-item label="租户状态" labelAlign="right" name="tenantStatus">
            <!-- <a-input v-model:value="addForm.tenantName" style="width: 400px" /> -->
            <a-switch
              checked-children="正常"
              un-checked-children="停用"
              v-model:checked="addForm.tenantStatus"
              :checkedValue="0"
              :unCheckedValue="1"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <a-modal
      v-model:visible="showConfig"
      :width="title === '配置菜单' ? '650px' : '1000px'"
      :title="title"
    >
      <template #footer>
        <a-button key="back" @click="showConfig = false" v-if="!showMonitor">取消</a-button>
        <a-button
          key="back"
          @click="(showMonitor = true), (isEditMon = false)"
          v-if="title === '配置模板' && !showMonitor"
          >返回</a-button
        >
        <a-button type="primary" @click="configData" v-if="!showMonitor && !isEditMon"
          >配置</a-button
        >
        <a-button type="primary" @click="saveMon" v-if="title === '配置模板' && isEditMon"
          >保存</a-button
        >
      </template>
      <div
        v-if="title === '配置菜单'"
        style="
          display: flex;
          padding: 10px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
          max-height: 90%;
          height: 550px;
          overflow-y: auto;
        "
      >
        <a-tree
          :tree-data="userTreeData"
          :show-line="true"
          checkable
          :field-names="userFieldNames"
          defaultExpandAll
          v-model:checkedKeys="userMenu"
        >
          <template #title="{ name }">
            <a-dropdown>
              <span> {{ name }} </span>
            </a-dropdown>
          </template>
        </a-tree>
      </div>
      <div v-if="title === '配置模板'">
        <div v-if="showMonitor">
          <a-button
            v-if="!monitorTable.length"
            type="primary"
            @click="(showMonitor = false), (monitorForm = {})"
          >
            新增
          </a-button>
          <a-table
            :columns="monitorCol"
            :data-source="monitorTable"
            style="margin-top: 5px"
            :scroll="{ x: 1800 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <div style="display: flex; justify-content: center">
                  <CBtn :showType="BTN_TYPE.edit" @click="editMon(record)"></CBtn>
                  <!-- <a-popconfirm title="是否删除?" @confirm="delMon(record)">
                    <CBtn :showType="BTN_TYPE.delete"></CBtn>
                  </a-popconfirm> -->
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'wqiPollutants'">
                <a-tag
                  type="primary"
                  size="small"
                  :key="data"
                  color="blue"
                  v-for="data in record[column.dataIndex].split(',')"
                >
                  {{
                    getValueByOptions(
                      data,
                      systemOptionsStore.codeOptions.map((item) => ({
                        label: item.paraName,
                        value: item.paraCode,
                      })),
                    )
                  }}
                </a-tag>
              </template>
              <template v-else-if="column.dataIndex === 'templateId'">
                {{ record[column.dataIndex] === '1' ? '系统默认' : '自定义' }}
              </template>
              <template v-else-if="column.dataIndex === 'alarmId'">
                <a-tag
                  type="primary"
                  size="small"
                  :key="data"
                  color="blue"
                  v-for="data in record[column.dataIndex]"
                >
                  {{ getValueByOptions(data, systemOptionsStore.alarmTypeOptions) }}
                </a-tag>
              </template>
              <template v-else-if="column.dataIndex === 'timeInterval'">
                {{ getValueByOptions(record[column.dataIndex].toString(), timeIntervalOptions) }}
              </template>
            </template>
          </a-table>
        </div>
        <div v-else>
          <a-form
            :model="monitorForm"
            ref="monitorRef"
            :labelCol="{ span: 6 }"
            v-if="title === '配置模板'"
          >
            <a-form-item label="模板名称" name="modelName" :rules="[{ required: true }]">
              <a-input v-model:value="monitorForm.modelName" />
            </a-form-item>
            <a-form-item label="计算模板" name="templateId" :rules="[{ required: true }]">
              <a-radio-group v-model:value="monitorForm.templateId">
                <a-radio :style="radioStyle" :value="'1'">系统默认</a-radio>
                <a-radio :style="radioStyle" :value="'自定义'" @click="changeTemplate"
                  >自定义</a-radio
                >
              </a-radio-group>

              <!-- <a-radio-group
                v-model:value="monitorForm.templateId"
                :options="templateOptions"
                @change="changeTemplate"
                @focus="focuesT"
              />{{ '1' }} -->
            </a-form-item>
            <a-form-item
              label="参与污染指数计算因子"
              name="wqiPollutants"
              :rules="[{ required: true }]"
            >
              <CSelect
                mode="multiple"
                placeholder="因子选择"
                :max-tag-count="4"
                style="width: 100%"
                v-model:value="monitorForm.wqiPollutants"
                :options="
                  systemOptionsStore.codeOptions.map((item) => ({
                    label: item.paraName,
                    value: item.paraCode,
                  }))
                "
              ></CSelect>
            </a-form-item>
            <a-form-item label="监测时间间隔" name="timeInterval" :rules="[{ required: true }]">
              <CSelect
                placeholder="监测时间间隔选择"
                style="width: 100%"
                v-model:value="monitorForm.timeInterval"
                :options="timeIntervalOptions"
              ></CSelect>
            </a-form-item>
            <a-form-item label="告警类型" name="alarmId" :rules="[{ required: true }]">
              <a-tree-select
                v-model:value="monitorForm.alarmId"
                style="width: 100%"
                tree-checkable
                tree-default-expand-all
                :show-checked-strategy="SHOW_PARENT"
                :height="233"
                :tree-data="systemOptionsStore.alarmTypeTree"
                :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
              >
              </a-tree-select>
            </a-form-item>
            <a-form-item label="备注" name="remarks">
              <a-input v-model:value="monitorForm.remarks" />
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div v-if="title === '配置管理账号'">
        <div v-if="showUser">
          <a-button type="primary" @click="showUser = false">新增</a-button>
          <a-table
            :columns="userCol"
            :data-source="userTable"
            bordered
            size="small"
            style="margin-top: 5px"
            :scroll="{ y: 240 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <div style="display: flex; justify-content: center">
                  <CBtn :showType="BTN_TYPE.config" @click="editMon(record)"></CBtn>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>
    <a-modal v-model:visible="showTemplateModel" width="1000px" title="自定义配置计算模板">
      <a-table
        style="margin-top: 20px"
        :columns="templateHeaders"
        :data-source="templateDataSource"
        bordered
        size="middle"
        :pagination="false"
        :scroll="{ y: 500 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'lower'">
            <div class="editable-cell">
              <div
                v-if="editableData[`${record.paraCode}-${record.categoryId}`]"
                class="editable-cell-input-wrapper"
              >
                <a-input
                  v-model:value="editableData[`${record.paraCode}-${record.categoryId}`].lower"
                  @pressEnter="save(`${record.paraCode}-${record.categoryId}`)"
                />
                <check-outlined
                  class="editable-cell-icon-check"
                  @click="save(`${record.paraCode}-${record.categoryId}`)"
                />
              </div>
              <div v-else class="editable-cell-text-wrapper">
                {{ getRangeValue(record.valueRange, 'lower') }}
                <edit-outlined
                  class="editable-cell-icon"
                  @click="edit(`${record.paraCode}-${record.categoryId}`)"
                />
              </div>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'upper'">
            <div class="editable-cell">
              <div
                v-if="editableData[`${record.paraCode}-${record.categoryId}`]"
                class="editable-cell-input-wrapper"
              >
                <a-input
                  v-model:value="editableData[`${record.paraCode}-${record.categoryId}`].upper"
                  @pressEnter="save(`${record.paraCode}-${record.categoryId}`)"
                />
                <check-outlined
                  class="editable-cell-icon-check"
                  @click="save(`${record.paraCode}-${record.categoryId}`)"
                />
              </div>
              <div v-else class="editable-cell-text-wrapper">
                {{ getRangeValue(record.valueRange, 'upper') }}
                <edit-outlined
                  class="editable-cell-icon"
                  @click="edit(`${record.paraCode}-${record.categoryId}`)"
                />
              </div>
            </div>
          </template>
        </template>
      </a-table>
      <template #footer>
        <a-button key="back" @click="cancelCustomParam">取消</a-button>
        <a-button type="primary" @click="saveTemplateModel"> 保存 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
  import { ref, onMounted, watch, reactive, nextTick } from 'vue';
  // import { message } from 'ant-design-vue';
  import searchIndex from '@/components/system-search/search-index.vue';
  import {
    tenantListApi,
    // addTenantApi,
    editTenantApi,
    delTenantApi,
    tenantMenuApi,
    getAllModel,
    saveModel,
    editModel,
    getModelById,
    // deleteModel,
    getTenantAdminApi,
    // addTenantAdminApi,
    getTemplateModelByModelId,
    saveTemplateModelBatch,
    getAlarmTypeByModelId,
    saveTenantAndAdmin,
  } from '@/api/systemSetting/systemManage/tenant';
  import { menuTreeApi } from '@/api/systemSetting/systemManage/menu';
  // import {
  //   addMonitorApi,
  //   MonitorListApi,
  //   editMonitorApi,
  //   delMonitorApi,
  // } from '@/api/system-manage/monitor.js';
  import { saveAlarmTypeBatch } from '@/api/alarm/alarmType';
  import { editUserApi } from '@/api/systemSetting/systemManage/user';
  import { message } from 'ant-design-vue';
  import { useSystemOptionsStore } from '@/stores/systemOptions';
  import { useDict } from '@/hooks/web/useDict';
  import { getValueByOptions, deepClone, dropRepetition } from '@/utils';

  const systemOptionsStore = useSystemOptionsStore();

  const timeIntervalOptions = ref([]);

  const showTemplateModel = ref(false);

  const searchData = ref({
    tenantName: {
      name: '租户名称',
      value: '',
      placeholder: '请输入租户名称',
      type: 'input',
    },
  });

  const offsetHeight = ref(document.body.offsetHeight - 260);

  const columns = ref([
    { title: '租户名称', dataIndex: 'tenantName', align: 'center' },
    {
      title: '租户状态',
      dataIndex: 'tenantStatus',
      align: 'center',
    },
    { title: '备注', dataIndex: 'remarks', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 320,
      align: 'center',
      type: ['edit'],
    },
  ]);

  const loginForm = ref({});
  const tableData = ref([]);
  const showModel = ref(false);
  const showConfig = ref(false);
  const title = ref('配置菜单');
  const addForm = ref({});
  const formRef = ref();
  const loginRef = ref();
  const areaTreeRef = ref();

  const saveTenantData = async () => {
    const values = await formRef.value.validateFields();
    const refLogin = await loginRef.value.validateFields();
    if (values && refLogin) {
      const params = {
        tenant: {
          tenantName: addForm.value.tenantName,
          tenantStatus: addForm.value.tenantStatus,
          areaId: addForm.value.areaId,
          remarks: addForm.value.remarks,
        },
        user: {
          userName: loginForm.value.loginName,
          loginName: loginForm.value.loginName,
          password: loginForm.value.password,
        },
      };
      const { data: res } = await saveTenantAndAdmin(params);
      if (res.code == 200) {
        message.success('新增成功');
        showModel.value = false;
        seekData();
      } else {
        message.error('新增失败');
      }
    }
  };

  const seekData = () => {
    current.value = 1;
    getTenant();
  };
  const addData = async () => {
    showModel.value = true;
    await nextTick();
    areaTreeRef.value.refreshData();
    addForm.value = {
      tenantName: '',
      tenantStatus: 0,
      areaId: '',
      remarks: '',
    };
    loginForm.value = {
      loginName: '',
      password: '',
    };
  };

  const showEdit = ref(false);
  const editData = async (val) => {
    showModel.value = true;
    showEdit.value = true;
    addForm.value = JSON.parse(JSON.stringify(val));
    const { data } = await getTenantAdminApi({ tenantId: val.tenantId, roleType: '2' });
    if (data.code === 200 && data.data !== null && data.data.length > 0) {
      loginForm.value = { ...data.data[0] };
    } else {
      loginForm.value = {
        loginName: '',
        password: '',
      };
    }
  };
  const editUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      const { data: res } = await editTenantApi(addForm.value);
      if (loginForm.value.password != null && loginForm.value.password != '') {
        const { data: item } = await editUserApi({
          loginName: loginForm.value.loginName,
          password: loginForm.value.password,
        });
        if (res.code == 200 && item.code == 200) {
          message.success('修改成功');
          getTenant();
          showModel.value = false;
        }
      } else {
        res.code === 200
          ? (message.success('修改成功'), getTenant(), (showModel.value = false))
          : message.error('修改失败');
      }
    }
  };
  const delData = async (val) => {
    const { data: res } = await delTenantApi(val.tenantId);
    res.code === 200
      ? (message.success('删除成功'), getTenant(), (showModel.value = false))
      : message.error('删除失败');
  };

  watch(showModel, () => {
    if (!showModel.value) {
      showEdit.value = false;
    }
  });

  const current = ref(1);
  const size = ref(10);
  const total = ref();

  const spinning = ref(false);

  const getTenant = async () => {
    spinning.value = true;
    const { data } = await tenantListApi(
      current.value,
      size.value,
      searchData.value.tenantName.value,
    );
    tableData.value = data.data.records;
    total.value = data.data.total;
    spinning.value = false;
  };

  const state = reactive({
    selectedRowKeys: [],
    loading: false,
  });

  watch([current, size], () => {
    getTenant();
  });

  // 计算模板选项
  // const templateOptions = ref([
  //   {
  //     label: '系统默认',
  //     value: '1',
  //   },
  //   {
  //     label: '自定义',
  //     value: '自定义',
  //   },
  // ]);

  const editableData = reactive({});
  const templateDataSource = ref([]);
  const templateHeaders = ref([
    {
      title: '参数编码',
      dataIndex: 'paraCode',
      align: 'center',
    },
    {
      title: '参数名称',
      dataIndex: 'paraName',
      align: 'center',
    },
    {
      title: '水质类别',
      dataIndex: 'waqCategory',
      align: 'center',
    },
    {
      title: '下限值（＞）',
      dataIndex: 'lower',
      align: 'center',
    },
    {
      title: '上限值（≤）',
      dataIndex: 'upper',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      align: 'center',
    },
  ]);

  const edit = (id) => {
    editableData[id] = deepClone(
      templateDataSource.value.filter((item) => id === `${item.paraCode}-${item.categoryId}`)[0],
    );
    editableData[id].lower = getRangeValue(editableData[id].valueRange, 'lower');
    editableData[id].upper = getRangeValue(editableData[id].valueRange, 'upper');
  };
  const save = (id) => {
    const target = templateDataSource.value.filter(
      (item) => id === `${item.paraCode}-${item.categoryId}`,
    )[0];
    if (editableData[id].lower >= editableData[id].upper) {
      message.error('下限值必须小于上限值');
      return;
    }
    Object.assign(target, editableData[id]);
    target.valueRange = `(${editableData[id].lower ? editableData[id].lower : ''},${
      editableData[id].upper ? editableData[id].upper : ''
    }]`;
    delete editableData[id];
  };

  const getRangeValue = (dataValue, type) => {
    // 去掉第一个和最后一个字符
    const value = dataValue.slice(1, dataValue.length - 1);
    const valueArr = value.split(',');
    if (type === 'lower') {
      return valueArr[0];
    }
    return valueArr[1];
  };

  const onSelectChange = (selectedRowKeys) => {
    state.selectedRowKeys = selectedRowKeys;
  };

  //配置菜单相关方法
  const userTreeData = ref([]);
  const userMenu = ref([]);
  const userFieldNames = ref({
    children: 'children',
    title: 'name',
    key: 'id',
  });
  const getMenuList = async () => {
    const { data } = await menuTreeApi();
    if (data.data) {
      userTreeData.value = data.data;
    } else {
      userTreeData.value = [];
    }
  };

  const confiMenu = async () => {
    title.value = '配置菜单';
    showMonitor.value = false;
    isEditMon.value = false;
    if (state.selectedRowKeys.length === 1) {
      showConfig.value = true;
      const { data: menu } = await menuTreeApi('', state.selectedRowKeys[0]);
      let idList = [];
      if (menu.data) {
        const getIds = (data) => {
          data.forEach((item) => {
            if (item.children && item.children.length > 0) {
              getIds(item.children);
            } else {
              idList.push(item.id);
            }
          });
        };
        getIds(menu.data);
      }
      userMenu.value = idList;
    } else {
      message.warning('只能选择一条数据');
    }
  };

  //配置模板相关方法
  const showMonitor = ref(false);
  const monitorCol = ref([
    { title: '模板名称', dataIndex: 'modelName', align: 'center', width: 200 },
    { title: '计算模板 ', dataIndex: 'templateId', align: 'center', width: 200 },
    { title: '参与污染指数计算因子', dataIndex: 'wqiPollutants', align: 'center', width: 300 },
    { title: '监测时间间隔', dataIndex: 'timeInterval', align: 'center', width: 200 },
    { title: '告警类型', dataIndex: 'alarmId', align: 'center', width: 400 },
    { title: '备注', dataIndex: 'remarks', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      fixed: 'right',
      width: 180,
    },
  ]);

  const monitorTable = ref([]);

  const getMonitor = async () => {
    const { data } = await getAllModel({ tenantId: state.selectedRowKeys[0] });
    if (data.data.records.length) {
      const { data: modelData } = await getAlarmTypeByModelId(data.data.records[0].modelId);
      monitorTable.value = [
        { ...data.data.records[0], alarmId: modelData.data.map((item) => item.alarmId) },
      ];
    } else {
      monitorTable.value = [];
    }
  };

  const confiMon = async () => {
    title.value = '配置模板';
    isEditMon.value = false;
    showMonitor.value = false;
    if (state.selectedRowKeys.length === 1) {
      await getMonitor();
      showMonitor.value = true;
      showConfig.value = true;
    } else {
      message.warning('只能选择一条数据');
    }
  };
  const currentTemplateId = ref('');
  const isEditMon = ref(false);
  const editMon = async (val) => {
    let row = {};
    const { data } = await getModelById(val.modelId);
    row = data.data;
    const { data: modelData } = await getAlarmTypeByModelId(val.modelId);
    currentTemplateId.value = row.templateId;
    isEditMon.value = true;
    monitorForm.value = row;
    monitorForm.value.wqiPollutants = row.wqiPollutants.split(',');
    monitorForm.value.timeInterval = row.timeInterval.toString();
    monitorForm.value.alarmId = modelData.data.map((item) => item.alarmId);
    monitorForm.value.templateId = row.templateId === '1' ? '1' : '自定义';
    showMonitor.value = false;
  };

  // 修改模板信息
  const saveMon = async () => {
    try {
      const values = await monitorRef.value.validateFields();
      if (values) {
        const params = deepClone(monitorForm.value);
        if (Array.isArray(monitorForm.value.wqiPollutants)) {
          params.wqiPollutants = params.wqiPollutants.join(',');
        }
        if (params.templateId === '自定义') {
          params.templateId = state.selectedRowKeys[0];
        } else {
          params.templateId = '1';
        }
        // 修改模板信息
        const { data: res } = await editModel(params);
        // 批量关联告警类型信息
        await saveAlarmTypeBatch({ id: params.modelId, relIds: params.alarmId });
        res.code === 200
          ? (message.success('修改成功'),
            getMonitor(),
            (showMonitor.value = true),
            (isEditMon.value = false))
          : message.error('修改失败');
      }
    } catch (err) {
      console.log(err);
    }
  };
  // const delMon = async (val) => {
  //   const { data: res } = await deleteModel(val.modelId);
  //   res.code === 200 ? (message.success('删除成功'), getMonitor()) : message.error('删除失败');
  // };

  const monitorForm = ref({});
  const monitorRef = ref();

  //配置账号相关方法
  const showUser = ref(false);
  const userCol = ref([
    { title: '姓名 ', dataIndex: 'userName', align: 'center' },
    { title: '用户账户 ', dataIndex: 'loginName', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
    },
  ]);
  const userTable = ref([]);

  // watch(
  //   () => monitorForm.value.templateId,
  //   async (val, before) => {
  //     if (val === '自定义'&before) {
  //       showTemplateModel.value = true;
  //       // 请求初始化计算模板
  //       const { data } = await getTemplateModelByModelId({ templateId: state.selectedRowKeys[0] });
  //       templateDataSource.value = data.data;
  //     }
  //   },
  // );

  const changeTemplate = async (e) => {
    if (e.target.value === '自定义') {
      showTemplateModel.value = true;
      // 请求初始化计算模板
      const { data } = await getTemplateModelByModelId({ templateId: state.selectedRowKeys[0] });
      templateDataSource.value = data.data;
    }
  };
  // 保存自定义计算模板
  const saveTemplateModel = async () => {
    try {
      const targetArr = templateDataSource.value.map((item) => ({
        ...item,
        templateId: state.selectedRowKeys[0],
      }));
      const { data } = await saveTemplateModelBatch(targetArr);
      message.success(data.msg);
      showTemplateModel.value = false;
    } catch (err) {
      console.log(err);
    }
  };

  const cancelCustomParam = () => {
    if (currentTemplateId.value === '1') {
      monitorForm.value.templateId = '1';
    }
    showTemplateModel.value = false;
  };

  let parentId = '';
  // 根据id查询返回父id
  const getParentId = (id, data) => {
    data.forEach((item) => {
      if (item.id === id) {
        parentId = item.parentId;
      } else if (item.children) {
        getParentId(id, item.children);
      }
    });
    return parentId;
  };

  //保存新增方法
  const configData = async () => {
    if (title.value === '配置菜单') {
      parentId = '';
      const parentIds = [];
      userMenu.value.forEach((id) => {
        parentIds.push(getParentId(id, userTreeData.value));
      });
      const { data: res } = await tenantMenuApi({
        id: state.selectedRowKeys[0],
        relIds: [...userMenu.value, ...dropRepetition(parentIds)],
      });
      res.code === 200
        ? (message.success('配置成功'),
          getTenant(),
          (showConfig.value = false),
          (userMenu.value = []))
        : message.error('配置失败');
    } else if (title.value === '配置模板') {
      const values = await monitorRef.value.validateFields();
      if (values) {
        const params = Object.assign(monitorForm.value);
        params.tenantId = state.selectedRowKeys[0];
        if (Array.isArray(monitorForm.value.wqiPollutants)) {
          params.wqiPollutants = monitorForm.value.wqiPollutants.join(',');
        }
        const { data: res } = await saveModel(params);
        res.code === 200
          ? (message.success('新增成功'),
            getTenant(),
            params.alarmId
              ? await saveAlarmTypeBatch({ id: res.data.modelId, relIds: params.alarmId })
              : '',
            (showConfig.value = false))
          : message.error('新增失败');
      }
    }
  };
  onMounted(async () => {
    getTenant();
    getMenuList();
    timeIntervalOptions.value = await useDict('time_interval');
    systemOptionsStore.getAllCode();
    systemOptionsStore.getAllAlarmTypeOptions();
    systemOptionsStore.getAlarmTypeTree();
  });
</script>
<style scoped lang="scss">
  .dict_body {
    margin-top: 12px;
    width: 100%;
  }
  .model_edit_box {
    width: 570px;
    height: 300px;
    overflow: auto;
    padding: 20px 30px;
  }

  .editable-cell {
    position: relative;
    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
      padding-right: 24px;
    }

    .editable-cell-text-wrapper {
      padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
      position: absolute;
      right: 0;
      width: 20px;
      cursor: pointer;
    }

    .editable-cell-icon {
      margin-top: 4px;
      display: none;
    }

    .editable-cell-icon-check {
      line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
      color: #108ee9;
    }

    .editable-add-btn {
      margin-bottom: 8px;
    }
  }
  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }
</style>
