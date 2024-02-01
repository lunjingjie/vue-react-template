<template>
  <div v-if="isShow">
    <div>
      <search-index
        :searchData="searchData"
        title="部门管理"
        :isAdd="true"
        @seek-data="seekData"
        @add-data="addData"
      />
    </div>

    <tableIndex
      :offsetWidth="offsetWidth"
      :offsetHeight="offsetHeight"
      :spinning="spinning"
      :columns="columns"
      :tableData="tableData.slice((current - 1) * size, current * size)"
      :total="total"
      v-model:current="current"
      v-model:pageSize="size"
      :tableDictData="{ officeType: officeTypeOptions }"
      @init-data="initData"
      @editData="editData"
      @delData="delData"
      @setData="addOffice"
    ></tableIndex>

    <a-modal
      v-model:visible="showModel"
      width="650px"
      :title="showMenu ? '新增子项' : showEdit ? '编辑部门' : '新增部门'"
    >
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" v-if="showEdit && !showMenu" @click="clickSave">保存</a-button>
        <a-button type="primary" v-else-if="!showEdit && !showMenu" @click="saveUserData"
          >新增</a-button
        >
        <a-button type="primary" v-else-if="showMenu" @click="addOfficeData">配置</a-button>
      </template>
      <div style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column">
        <a-form :model="addForm" :labelCol="{ span: 4 }" ref="formRef">
          <a-form-item
            label="上级部门"
            labelAlign="right"
            name="pOfficeId"
            :rules="[{ required: true }]"
          >
            <a-cascader
              v-model:value="addForm.pOfficeId"
              :options="officeList"
              :disabled="disabled"
              change-on-select
              style="width: 400px"
              placeholder="请选择上级部门"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
            >
              <template #tagRender="data">
                <a-tag :key="data.id" color="blue">{{ data.name }}</a-tag>
              </template>
            </a-cascader>
          </a-form-item>
          <a-form-item
            label="部门名"
            labelAlign="right"
            name="officeName"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="addForm.officeName" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="部门类型"
            labelAlign="right"
            name="officeType"
            :rules="[{ required: true }]"
          >
            <CSelect
              style="width: 400px; margin-left: 0"
              placeholder="部门类型选择"
              v-model:value="addForm.officeType"
              :options="officeTypeOptions"
            ></CSelect>
          </a-form-item>
          <a-form-item label="联系电话" labelAlign="right">
            <a-input v-model:value="addForm.linkPhone" style="width: 400px" />
          </a-form-item>
          <a-form-item label="联系人" labelAlign="right">
            <a-input v-model:value="addForm.linkMan" style="width: 400px" />
          </a-form-item>
          <a-form-item label="备注" labelAlign="right">
            <a-input v-model:value="addForm.remarks" style="width: 400px" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import searchIndex from '@/components/system-search/search-index.vue';
  import tableIndex from '@/components/table/indexPage.vue';
  import {
    officeByIdApi,
    addOfficeApi,
    editOfficeApi,
    delOfficeApi,
    officeTreeApi,
  } from '@/api/systemSetting/systemManage/department';
  import { message } from 'ant-design-vue';
  import { useDict } from '@/hooks/web/useDict';

  const offsetWidth = ref(1000);
  const offsetHeight = ref(document.body.offsetHeight - 202);
  const isShow = ref(true);
  const showModel = ref(false);
  const showEdit = ref(false);
  const showMenu = ref(false);
  const disabled = ref(false);
  const showAdd = ref(false);
  const spinning = ref(true);
  const current = ref(1);
  const size = ref(10);
  const officeTypeOptions = ref([]);

  const columns = ref([
    { title: '名称', dataIndex: 'name', align: 'center' },
    { title: '联系人', dataIndex: 'linkMan', align: 'center' },
    { title: '联系电话', dataIndex: 'linkPhone', align: 'center' },
    { title: '部门类型', dataIndex: 'officeType', align: 'center', type: 'fromDictData' },
    { title: '备注', dataIndex: 'remarks', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 300,
      align: 'center',
      type: ['edit', 'delete', 'addmenu'],
      fixed: 'right',
    },
  ]);

  const searchData = ref({
    officeName: {
      name: '部门名称',
      value: '',
      placeholder: '请输入部门名',
      type: 'input',
    },
  });

  const treeData = ref([
    {
      name: '部门列表',
      key: '0',
    },
  ]);

  const addForm = ref({});

  const addData = () => {
    showModel.value = true;
    showMenu.value = false;
    showEdit.value = false;
    showAdd.value = false;
    disabled.value = false;
    addForm.value = {
      pOfficeId: '0',
    };
  };

  const editData = async (val) => {
    showAdd.value = true;
    showMenu.value = false;
    showEdit.value = true;
    const { data: res } = await officeByIdApi(val.id);
    res.code === 200
      ? ((addForm.value = res.data),
        (showModel.value = true),
        (disabled.value = false),
        (addForm.value.pOfficeId = get_level_all(
          officeList.value,
          addForm.value.pOfficeId,
        ).reverse()))
      : '';
  };
  const addOfficeData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pOfficeId = addForm.value.pOfficeId[addForm.value.pOfficeId.length - 1];

      const { data: res } = await addOfficeApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), getOfficeList(), (showModel.value = false))
        : message.error('新增失败');
    }
  };
  const addOffice = async (val) => {
    spinning.value = true;
    showAdd.value = false;
    showMenu.value = true;
    addForm.value = {};
    const { data: res } = await officeByIdApi(val.id);
    res.code === 200
      ? ((showModel.value = true),
        (disabled.value = true),
        (spinning.value = false),
        (addForm.value.pOfficeId = get_level_all(officeList.value, val.id).reverse()))
      : '';
  };
  const get_level_all = (data, id, arr = []) => {
    data.find((item) => {
      if (item.id === id) {
        arr.push(item.id);
        return true;
      } else if (item.children && item.children.length > 0) {
        arr = get_level_all(item.children, id, arr);
        if (arr.length) {
          arr.push(item.id);
          return true;
        } else {
          return false;
        }
      }
      return false;
    });
    return arr;
  };

  const seekData = () => {
    searchData.value.officeName.value
      ? getOfficeList(searchData.value.officeName.value)
      : getOfficeList();
  };

  const formRef = ref();
  const saveUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pOfficeId = addForm.value.pOfficeId[addForm.value.pOfficeId.length - 1];
      const { data: res } = await addOfficeApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), getOfficeList(), (showModel.value = false))
        : message.error('新增失败');
    }
  };
  const clickSave = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pOfficeId = addForm.value.pOfficeId[addForm.value.pOfficeId.length - 1];
      const { data: res } = await editOfficeApi(addForm.value);
      res.code === 200
        ? (message.success('修改成功'),
          getOfficeList(),
          (showModel.value = false),
          (addForm.value.pOfficeId = get_level_all(
            officeList.value,
            addForm.value.pOfficeId,
          ).reverse()))
        : message.error('修改失败');
    }
  };

  const delData = async (val) => {
    const { data: res } = await delOfficeApi(val.id);
    res.code === 200
      ? (message.success('删除成功'),
        getOfficeList(),
        (showModel.value = false),
        (addForm.value = {}))
      : message.error('删除失败');
  };
  const total = ref();
  const tableData = ref([]);

  const getOfficeList = async (body) => {
    const { data: res } = await officeTreeApi(body);
    if (res.code === 200) {
      spinning.value = false;
      if (res.data) {
        changeTree(res.data);
        tableData.value = res.data;
        total.value = res.data.length;
        current.value = 1;
      } else {
        tableData.value = [];
        total.value = 0;
      }
    }
  };
  const getAllTree = async () => {
    const { data: res } = await officeTreeApi();
    if (res.code === 200) {
      officeList.value[0].children = res.data;
      treeData.value[0].children = res.data;
    } else {
      officeList.value[0].children = [];
      treeData.value[0].children = [];
    }
  };
  const initData = (val) => {
    current.value = val.current;
    size.value = val.pageSize;
  };
  // 把树状结构childen为[]的修改为null
  const changeTree = (data) => {
    data.forEach((item) => {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        changeTree(item.children);
      }
    });
  };

  const officeList = ref([
    {
      name: '部门列表',
      id: '0',
    },
  ]);
  onMounted(async () => {
    officeTypeOptions.value = await useDict('office_type');
    getOfficeList();
    getAllTree();
  });
</script>
