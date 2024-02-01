<template>
  <div>
    <div>
      <search-index
        :searchData="searchData"
        title="菜单管理"
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
      width="650px"
      :title="showMenu ? '新增子项' : showEdit ? '编辑菜单' : '新增菜单'"
    >
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" v-if="showEdit && !showMenu" @click="clickSave">保存</a-button>
        <a-button type="primary" v-else-if="!showEdit && !showMenu" @click="saveUserData"
          >新增</a-button
        >
        <a-button type="primary" v-else-if="showMenu" @click="addMenuData">配置</a-button>
      </template>
      <div style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column">
        <a-form :model="addForm" :labelCol="{ span: 4 }" ref="formRef">
          <a-form-item
            label="上级菜单"
            labelAlign="right"
            name="pMenuId"
            :rules="[{ required: true }]"
          >
            <a-cascader
              v-model:value="addForm.pMenuId"
              :options="menuList"
              :disabled="disabled"
              change-on-select
              style="width: 400px"
              placeholder="请选择上级菜单"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
            >
              <template #tagRender="data">
                <a-tag :key="data.id" color="blue">{{ data.name }}</a-tag>
              </template>
            </a-cascader>
          </a-form-item>
          <a-form-item
            label="菜单名"
            labelAlign="right"
            name="menuName"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="addForm.menuName" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="链接"
            labelAlign="right"
            name="menuPath"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="addForm.menuPath" style="width: 400px" />
          </a-form-item>
          <a-form-item label="图标" labelAlign="right" style="display: flex; flex-direction: row">
            <a-input v-model:value="addForm.menuIcon" style="width: 400px; margin-right: 5px" />
            <Icon v-if="addForm.menuIcon" :icon="addForm.menuIcon"></Icon>
            <!-- <a-button @click="$refs.files.click()">选择</a-button>
            <input
              type="file"
              @change="inputfile()"
              id="fileItem"
              ref="files"
              style="display: none"
            /> -->
          </a-form-item>
          <a-form-item label="排序" labelAlign="right">
            <a-input v-model:value="addForm.menuSort" style="width: 400px" />
          </a-form-item>
          <a-form-item label="权限标识" labelAlign="right">
            <a-input v-model:value="addForm.permission" style="width: 400px" />
          </a-form-item>
          <a-form-item label="备注" labelAlign="right">
            <a-textarea v-model:value="addForm.remarks" style="width: 400px" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import searchIndex from '@/components/system-search/search-index.vue';
  import tableIndex from '@/components/table/indexPage.vue';
  import { message } from 'ant-design-vue';
  import {
    menuTreeApi,
    menuSaveApi,
    menuDeleteApi,
    menuIdApi,
    menuEditApi,
    menuListApi,
  } from '@/api/systemSetting/systemManage/menu';

  const offsetWidth = ref(1000);
  const offsetHeight = ref(document.body.offsetHeight - 202);
  const showModel = ref(false);
  const showAdd = ref(true);
  const showEdit = ref(false);
  const showMenu = ref(false);
  const disabled = ref(false);
  const spinning = ref(true);
  const title = ref('新增菜单');

  const columns = ref([
    { title: '菜单名称', dataIndex: 'name', align: 'center' },
    { title: '图标', dataIndex: 'icon', align: 'center', type: 'icon' },
    { title: '路由', dataIndex: 'url', align: 'center' },
    { title: '排序', dataIndex: 'sort', align: 'center' },
    { title: '权限标识', dataIndex: 'permission', align: 'center' },
    { title: '备注', dataIndex: 'remarks', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 300,
      align: 'center',
      type: ['edit', 'delete', 'addmenu'],
    },
  ]);

  const searchData = ref([
    {
      name: '菜单名称',
      value: '',
      placeholder: '请输入菜单名',
      type: 'input',
    },
  ]);

  const menuList = ref([
    {
      name: '菜单列表',
      id: '0',
    },
  ]);

  const addForm = ref({});

  const addData = () => {
    title.value = '新增菜单';
    showModel.value = true;
    showMenu.value = false;
    showEdit.value = false;
    showAdd.value = false;
    disabled.value = false;
    addForm.value = {};
  };

  const editData = async (data) => {
    showAdd.value = true;
    showMenu.value = false;
    showEdit.value = true;
    const { data: res } = await menuIdApi(data.id);
    res.code === 200
      ? ((addForm.value = res.data),
        (showModel.value = true),
        (disabled.value = false),
        (addForm.value.pMenuId = get_level_all(menuList.value, addForm.value.pMenuId).reverse()))
      : '';
  };
  const addMenuData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pMenuId = addForm.value.pMenuId[addForm.value.pMenuId.length - 1];

      const { data: res } = await menuSaveApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), getMenuList(), (showModel.value = false))
        : message.error('新增失败');
    }
  };
  const get_level_all = (data, id, arr = []) => {
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
  };
  const delData = async (val) => {
    const { data: res } = await menuDeleteApi(val.id);
    res.code === 200 ? (message.success('删除成功'), getMenuList()) : message.error('删除失败');
  };
  const addMenu = async (val) => {
    spinning.value = true;
    showAdd.value = false;
    showMenu.value = true;
    addForm.value = {};
    const { data: res } = await menuIdApi(val.id);
    res.code === 200
      ? ((showModel.value = true),
        (disabled.value = true),
        (spinning.value = false),
        (addForm.value.pMenuId = get_level_all(menuList.value, val.id).reverse()))
      : '';
  };
  const formRef = ref();
  const saveUserData = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pMenuId = addForm.value.pMenuId[addForm.value.pMenuId.length - 1];
      const { data: res } = await menuSaveApi(addForm.value);
      res.code === 200
        ? (message.success('新增成功'), getMenuList(), (showModel.value = false))
        : message.error('新增失败');
    }
  };
  const clickSave = async () => {
    const values = await formRef.value.validateFields();
    if (values) {
      addForm.value.pMenuId = addForm.value.pMenuId[addForm.value.pMenuId.length - 1];

      const { data: res } = await menuEditApi(addForm.value);
      res.code === 200
        ? (message.success('修改成功'),
          (addForm.value.pMenuId = get_level_all(menuList.value, addForm.value.pMenuId).reverse()),
          seekData(),
          (showModel.value = false))
        : message.error('修改失败');
    }
  };
  const seekData = () => {
    searchData.value[0].value
      ? ((current.value = '1'), getListById(searchData.value[0].value))
      : ((current.value = '1'), getMenuList());
  };

  const getListById = async (value) => {
    const { data } = await menuListApi(current.value, size.value, { menuName: value });
    if (data && data.code === 200) {
      tableData.value = data.data.records.map((item) => ({
        ...item,
        id: item.menuId,
        name: item.menuName,
        icon: item.menuIcon,
        url: item.menuPath,
        sort: item.menuSort,
        remarks: item.remarks,
      }));
      total.value = data.data.total;
    }
  };

  const current = ref(1);
  const size = ref(10);
  const total = ref();
  const tableData = ref([]);
  const getMenuList = async (body) => {
    const { data: res } = await menuTreeApi(body);
    changeTree(res.data);
    res.code === 200
      ? ((spinning.value = false),
        (tableData.value =
          res.data.slice((current.value - 1) * size.value, current.value * size.value) ?? []),
        (total.value = res.data.length))
      : true;
    const { data: tree } = await menuTreeApi(name);
    menuList.value[0].children = tree.data ?? [];
  };
  watch(size, () => {
    searchData.value[0].value ? getListById(searchData.value[0].value) : getMenuList();
  });
  watch(current, () => {
    searchData.value[0].value ? getListById(searchData.value[0].value) : getMenuList();
  });
  const initData = (val) => {
    current.value = val.current;
    size.value = val.pageSize;
  };
  // 把树状结构childen为[]的修改为null
  const changeTree = (data) => {
    if (data) {
      data.forEach((item) => {
        if (item.children.length === 0) {
          delete item.children;
        } else {
          changeTree(item.children);
        }
      });
    }
  };

  onMounted(() => {
    getMenuList();
  });
</script>

<style scoped>
  .menu_body {
    margin-top: 12px;
    width: 100%;
  }
</style>
