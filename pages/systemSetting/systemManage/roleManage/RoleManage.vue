<template>
  <div>
    <div>
      <search-index
        :searchData="searchData"
        title="角色管理"
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
      :tableData="tableData"
      :total="total"
      v-model:current="current"
      v-model:pageSize="size"
      @init-data="initData"
      @editData="editData"
      @delData="delData"
      @setData="addMenu"
    ></tableIndex>

    <a-modal
      v-model:visible="showModel"
      :width="showMenu ? '650px' : '650px'"
      :title="showMenu ? '配置菜单' : showEdit ? '编辑角色' : '新增角色'"
    >
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" v-if="!showEdit && !showMenu" @click="saveUserData">新增</a-button>
        <a-button type="primary" v-else-if="showEdit && !showMenu" @click="clickSave"
          >保存</a-button
        >
        <a-button type="primary" v-else-if="showMenu" @click="addMenuData">配置</a-button>
      </template>
      <div
        v-if="showAdd"
        style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column"
      >
        <a-form :model="addForm" :labelCol="{ span: 4 }" ref="formRef">
          <a-form-item
            label="角色名"
            labelAlign="right"
            :rules="[{ required: true }]"
            name="roleName"
          >
            <a-input v-model:value="addForm.roleName" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="角色类型"
            labelAlign="right"
            :rules="[{ required: true }]"
            name="roleType"
          >
            <a-select v-model:value="addForm.roleType" :options="typeList" style="width: 400px" />
          </a-form-item>
          <a-form-item label="备注" labelAlign="right">
            <a-textarea v-model:value="addForm.remarks" style="width: 400px" />
          </a-form-item>
          <!-- <a-form-item label="是否启用*" labelAlign="right">
            <a-radio-group
              v-model:value="formState.isStart"
              :options="showOPt"
              style="width: 400px"
            />
          </a-form-item> -->
        </a-form>
      </div>
      <div
        v-else-if="showMenu"
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
          defaultExpandAll
          :field-names="userFieldNames"
          v-model:checkedKeys="userMenu"
          @check="onCheck"
        >
          <template #title="{ name }">
            <a-dropdown>
              <span> {{ name }} </span>
            </a-dropdown>
          </template>
        </a-tree>
      </div>
    </a-modal>
  </div>
</template>
<script setup name="roleIndex">
  import { onMounted, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import searchIndex from '@/components/system-search/search-index.vue';
  import tableIndex from '@/components/table/indexPage.vue';
  import {
    roleListApi,
    addRoleApi,
    editRoleApi,
    delRoleApi,
    roleMenuApi,
  } from '@/api/systemSetting/systemManage/role';
  import { menuTreeApi } from '@/api/systemSetting/systemManage/menu';

  const offsetWidth = ref(1000);
  const offsetHeight = ref(document.body.offsetHeight - 202);
  const showModel = ref(false);
  const showEdit = ref(false);
  const showAdd = ref(true);
  const showMenu = ref(false);
  const spinning = ref(true);

  const columns = ref([
    { title: '角色名称', dataIndex: 'roleName', align: 'center' },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      align: 'center',
      type: 'isConvert',
      data: new Map().set('1', '超级管理员').set('2', '租户管理员').set('3', '普通用户'),
    },
    { title: '备注', dataIndex: 'remarks', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 280,
      align: 'center',
      type: ['edit', 'delete', 'configure'],
    },
  ]);
  // 保存时用到的id，包括父节点
  const saveMenuIds = ref([]);

  const onCheck = (a, b) => {
    saveMenuIds.value = [...a, ...b.halfCheckedKeys];
  };

  const searchData = ref({
    roleName: {
      name: '角色名称',
      value: '',
      placeholder: '请输入角色名',
      type: 'input',
    },
  });

  const userFieldNames = ref({
    children: 'children',
    title: 'name',
    key: 'id',
  });

  const userTreeData = ref([]);

  const addForm = ref({});

  const addData = () => {
    showModel.value = true;
    showAdd.value = true;
    showEdit.value = false;
    showMenu.value = false;
    addForm.value = {};
  };
  const userMenu = ref([]);
  const editData = async (val) => {
    showModel.value = true;
    showEdit.value = true;
    showAdd.value = true;
    showMenu.value = false;
    addForm.value = Object.assign({}, val);
  };

  const addMenu = async (val) => {
    showModel.value = true;
    showAdd.value = false;
    showMenu.value = true;

    selectRoleId.value = val.roleId;
    const { data: menu } = await menuTreeApi(val.roleId);
    let idList = [];
    if (menu.data) {
      // 遍历树状结构，获取所有的id
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
  };

  const selectRoleId = ref(null);

  const delData = async (val) => {
    const { data: res } = await delRoleApi(val.roleId);
    res.code === 200 ? (message.success('删除成功'), getRoleTree()) : message.error('删除失败');
  };
  const formRef = ref();
  const saveUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      const { data: res } = await addRoleApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), getRoleTree(), (showModel.value = false))
        : message.error('新增失败');
    }
  };
  const clickSave = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      const { data: res } = await editRoleApi(addForm.value);
      res.code === 200
        ? (message.success('修改成功'), getRoleTree(), (showModel.value = false))
        : message.error('修改失败');
    }
  };
  const addMenuData = async () => {
    const { data: res } = await roleMenuApi({
      id: selectRoleId.value,
      relIds: saveMenuIds.value.length ? saveMenuIds.value : userMenu.value,
    });
    res.code === 200
      ? (message.success('配置成功'), getRoleTree(), (showModel.value = false))
      : message.error('配置失败');
  };
  const seekData = () => {
    current.value = 1;
    getRoleTree();
  };
  const initData = (val) => {
    current.value = val.current;
    size.value = val.pageSize;
  };
  const current = ref(1);
  const size = ref(10);
  watch(size, () => {
    getRoleTree();
  });
  watch(current, () => {
    getRoleTree();
  });
  const total = ref();
  const tableData = ref([]);
  const getRoleTree = async () => {
    const { data: res } = await roleListApi(
      current.value,
      size.value,
      searchData.value.roleName.value,
    );
    res.code === 200
      ? ((spinning.value = false),
        (tableData.value = res.data.records),
        (total.value = res.data.total))
      : true;
  };

  const typeList = ref([
    // {
    //   value: '1',
    //   label: '超级管理员',
    // },
    {
      value: '2',
      label: '租户管理员',
    },
    {
      value: '3',
      label: '普通用户',
    },
  ]);
  const getMenuList = async () => {
    const { data } = await menuTreeApi();
    userTreeData.value = data.data ?? [];
  };
  onMounted(() => {
    getRoleTree();
    getMenuList({});
  });
</script>
