<template>
  <div>
    <div>
      <search-index
        :searchData="searchData"
        title="用户管理"
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
      v-model:pageSize="size"
      @init-data="initData"
      @editData="editData"
      @delData="delData"
      @setData="addMenu"
    ></tableIndex>

    <a-modal
      v-model:visible="showModel"
      width="650px"
      :title="showMenu ? '配置角色' : showEdit ? '编辑用户' : '新增用户'"
      :maskClosable="false"
    >
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" v-if="!showEdit && !showMenu" @click="addUserData">新增</a-button>
        <a-button type="primary" v-else-if="showEdit && !showMenu" @click="editUserData"
          >保存</a-button
        >
        <a-button type="primary" v-else-if="showMenu" @click="addRoleData">配置</a-button>
      </template>
      <div
        v-if="showAdd"
        style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column"
      >
        <a-form :model="addForm" :labelCol="{ span: 4 }" ref="formRef">
          <a-form-item
            label="用户名称"
            labelAlign="right"
            name="userName"
            :rules="[
              { required: true },
              // {
              //   pattern: new RegExp('^[0-9a-zA-Z_\u4e00-\u9fa5]{1,}$', 'g'),
              //   message: '只允许包含数字、字母、汉字、下划线',
              // },
            ]"
          >
            <a-input v-model:value="addForm.userName" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="登陆账号"
            labelAlign="right"
            name="loginName"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="addForm.loginName" style="width: 400px" :disabled="showEdit" />
          </a-form-item>
          <a-form-item
            label="密码"
            labelAlign="right"
            name="password"
            :rules="[{ required: !showEdit }]"
          >
            <a-input v-model:value="addForm.password" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="所属部门"
            name="officeId"
            labelAlign="right"
            :rules="[{ required: true }]"
          >
            <a-cascader
              v-model:value="addForm.officeId"
              :options="officeList"
              style="width: 400px"
              change-on-select
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
            >
              <template #tagRender="data">
                <a-tag :key="data.id" color="blue">{{ data.name }}</a-tag>
              </template>
            </a-cascader>
          </a-form-item>
          <a-form-item
            label="手机号"
            labelAlign="right"
            name="userPhone"
            :rules="[
              {
                pattern:
                  /^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[3|6|7|8]|18[0|1|2|3|4|5|6|7|8|9]|19[0|1|3|8|9])\d{8}$/,
                message: '请输入正确的11位手机号码',
                trigger: 'blur',
              },
            ]"
          >
            <a-input v-model:value="addForm.userPhone" style="width: 400px" />
          </a-form-item>
          <a-form-item label="备注" labelAlign="right">
            <a-input v-model:value="addForm.remarks" style="width: 400px" />
          </a-form-item>
        </a-form>
      </div>
      <div v-else-if="showMenu">
        <div style="display: flex; justify-content: center; align-items: center">
          <span style="margin-right: 20px">分配角色:</span>
          <a-select
            v-model:value="roleForm.relIds"
            style="width: 300px"
            placeholder="选择角色"
            mode="tags"
          >
            <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div></div
      >
    </a-modal>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import searchIndex from '@/components/system-search/search-index.vue';
  import tableIndex from '@/components/table/indexPage.vue';
  import {
    detailListApi,
    addUserApi,
    editUserApi,
    delUserApi,
    userRoleApi,
    userByIdApi,
  } from '@/api/systemSetting/systemManage/user';
  import { roleListApi } from '@/api/systemSetting/systemManage/role';
  import { officeTreeApi, officeListApi } from '@/api/systemSetting/systemManage/department';
  import { message } from 'ant-design-vue';

  const offsetHeight = ref(document.body.offsetHeight - 202);
  const spinning = ref(false);
  const showModel = ref(false);
  const showEdit = ref(false);
  const showAdd = ref(false);
  const showMenu = ref(false);

  const searchData = ref({
    userName: {
      name: '用户名称',
      value: '',
      placeholder: '请输入用户名称',
      type: 'input',
    },
    loginName: {
      name: '登陆账号',
      value: '',
      placeholder: '请输入登陆账号',
      type: 'input',
    },
  });
  const columns = ref([
    { title: '用户名称', dataIndex: 'userName', align: 'center' },
    { title: '登陆账号', dataIndex: 'loginName', align: 'center' },
    {
      title: '所属部门',
      dataIndex: 'officeId',
      align: 'center',
      type: 'hasMethod',
      method: getOfficeName,
    },
    {
      title: '所属角色',
      dataIndex: 'roles',
      align: 'center',
      type: 'hasMethod',
      method: getRoleName,
    },
    {
      title: '用户状态',
      dataIndex: 'userStatus',
      align: 'center',
      type: 'isConvert',
      data: new Map().set(0, '有效').set(1, '冻结').set(2, '禁用'),
    },
    { title: '手机号', dataIndex: 'userPhone', align: 'center' },
    { title: '邮箱', dataIndex: 'email', align: 'center' },
    { title: '备注', dataIndex: 'remarks', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 280,
      align: 'center',
      type: ['edit', 'delete', 'addrole'],
    },
  ]);

  const tableData = ref([]);
  const addForm = ref({
    userName: '',
    password: '',
    loginName: '',
    // officeId: '',
    userPhone: '',
    remarks: '',
    userStatus: 0,
  });
  const roleForm = ref({
    id: '',
    relIds: [],
  });
  const addData = () => {
    showModel.value = true;
    showEdit.value = false;
    showAdd.value = true;
    showMenu.value = false;
    if (formRef.value) {
      formRef.value.resetFields();
    }
    addForm.value = {};
  };
  const editData = async (val) => {
    showModel.value = true;
    showEdit.value = true;
    showAdd.value = true;
    showMenu.value = false;
    const { data: res } = await userByIdApi(val.userId);
    addForm.value = JSON.parse(JSON.stringify(res.data));
    addForm.value.officeId = get_level_all(officeList.value, addForm.value.officeId).reverse();
  };
  const delData = async (val) => {
    const { data: res } = await delUserApi(val.userId);
    res.code === 200
      ? (message.success('删除成功'), getUserList(), (showModel.value = false))
      : message.error('删除失败');
  };
  const seekData = () => {
    current.value = 1;
    getUserList();
  };

  const formRef = ref();
  const addUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.userStatus = 0;
      const { data: res } = await addUserApi({
        ...addForm.value,
        officeId: addForm.value.officeId
          ? addForm.value.officeId[addForm.value.officeId.length - 1]
          : '',
      });
      res.code === 200
        ? (message.success('新增成功'), getUserList(), (showModel.value = false))
        : message.error('新增失败');
    }
  };
  const editUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      const { data: res } = await editUserApi({
        ...addForm.value,
        officeId: addForm.value.officeId
          ? addForm.value.officeId[addForm.value.officeId.length - 1]
          : '',
      });
      res.code === 200
        ? (message.success('修改成功'), getUserList(), (showModel.value = false))
        : message.error('修改失败');
    }
  };

  const addMenu = async (val) => {
    showModel.value = true;
    showAdd.value = false;
    showMenu.value = true;
    roleForm.value.id = val.userId;
    roleForm.value.relIds = [];
    val.roles.forEach((res) => {
      roleForm.value.relIds.push(res.roleId);
    });
  };

  const current = ref(1);
  const size = ref(10);
  const total = ref();
  const getUserList = async () => {
    spinning.value = true;
    const { data: res } = await detailListApi(
      current.value,
      size.value,
      searchData.value.userName.value,
      searchData.value.loginName.value,
    );
    tableData.value = res.data.records;
    total.value = res.data.total;
    spinning.value = false;
  };
  watch(size, () => {
    getUserList({});
  });
  watch(current, () => {
    getUserList({});
  });
  const initData = (val) => {
    current.value = val.current;
    size.value = val.pageSize;
  };
  const roleList = ref([]);
  const getRoleList = async (body) => {
    const { data: res } = await roleListApi(current.value, size.value, body);
    res.data.records.forEach((item) => {
      roleList.value.push({
        name: item.roleName,
        id: item.roleId,
      });
    });
  };
  const officeList = ref([
    {
      name: '部门列表',
      id: '0',
    },
  ]);

  const nameList = ref([]);
  const getOfficeList = async () => {
    const { data } = await officeTreeApi();
    officeList.value[0].children = data.data;
    const { data: res } = await officeListApi(current.value, size.value, {});
    res.data.records.forEach((item) => {
      nameList.value.push({
        id: item.officeId,
        name: item.officeName,
      });
    });
  };
  const addRoleData = async () => {
    const { data: res } = await userRoleApi(roleForm.value);
    res.code === 200
      ? (message.success('配置角色成功'), getUserList(), (showModel.value = false))
      : message.error('配置角色失败');
  };
  function get_level_all(data, id, arr = []) {
    data.find((item) => {
      if (item.id === id) {
        arr.push(item.id);
        return true;
      } else if (item.children.length > 0) {
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
  }
  function getRoleName(val) {
    let roles = [];
    val.forEach((item) => {
      roles.push(item.roleName);
    });
    return String(roles);
  }
  function getOfficeName(val) {
    let name = '';
    if (val) {
      nameList.value.forEach((item) => {
        if (val === item.id) {
          name = item.name;
        }
      });
      return name;
    }
  }

  onMounted(() => {
    getUserList();
    getRoleList();
    getOfficeList();
  });
</script>

<style scoped>
  .user_body {
    margin-top: 12px;
    width: 100%;
  }
</style>
