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
      @editData="editData"
      @delData="delData"
      @setData="deployRole"
      @init-data="initData"
    ></tableIndex>
    <a-modal v-model:visible="showModel" width="650px" :title="showEdit ? '编辑字典' : '新增字典'">
      <template #footer>
        <a-button key="back" @click="showModel = false">取消</a-button>
        <a-button type="primary" @click="saveDictData">保存</a-button>
      </template>
      <div style="margin: 0px 30px; dispaly: flex; justify-content: center; flex-direction: column">
        <a-form
          :model="addForm"
          :label-col="{
            style: {
              width: '50px',
            },
          }"
        >
          <a-form-item
            label="键值"
            labelAlign="right"
            :rules="{ required: true, message: '请输入键值' }"
          >
            <a-input v-model:value="addForm.dictValue" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="标签"
            labelAlign="right"
            :rules="{ required: true, message: '请输入标签' }"
          >
            <a-input v-model:value="addForm.dictLabel" style="width: 400px" />
          </a-form-item>
          <a-form-item
            label="类型"
            labelAlign="right"
            :rules="{ required: true, message: '请输入类型' }"
          >
            <a-input v-model:value="addForm.dictType" style="width: 400px" />
          </a-form-item>
          <a-form-item label="描述" labelAlign="right">
            <a-input v-model:value="addForm.dictDesc" style="width: 400px" />
          </a-form-item>
          <a-form-item label="排序" labelAlign="right">
            <a-input v-model:value="addForm.dictSort" style="width: 400px" />
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
  import { ref, onMounted, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import searchIndex from '@/components/system-search/search-index.vue';
  import tableIndex from '@/components/table/indexPage.vue';
  import {
    getDictListData,
    addDictData,
    editDictData,
    delDictData,
  } from '@/api/systemSetting/systemManage/dict';
  const searchData = ref({
    labelName: {
      name: '标签名',
      value: '',
      placeholder: '请输入字标签名',
      type: 'input',
    },
    dictType: {
      name: '字典类型',
      value: '',
      placeholder: '请输入字典类型',
      type: 'input',
    },
  });

  const offsetHeight = ref(document.body.offsetHeight - 202);

  const columns = ref([
    { title: '键值', dataIndex: 'dictValue', align: 'center' },
    { title: '标签名', dataIndex: 'dictLabel', align: 'center' },
    { title: '类型', dataIndex: 'dictType', align: 'center' },
    { title: '描述', dataIndex: 'dictDesc', align: 'center' },
    { title: '排序', dataIndex: 'dictSort', align: 'center' },
    { title: '备注', dataIndex: 'remarks', align: 'center' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 260,
      align: 'center',
      type: ['edit', 'delete', 'addKey'],
      fixed: 'right',
    },
  ]);
  const tableData = ref([]);
  const showModel = ref(false);
  const addForm = ref({});
  const saveDictData = async () => {
    if (addForm.value.dictValue == '') {
      message.error('字典键值不能为空');
    } else if (addForm.value.dictLabel == '') {
      message.error('字典标签名不能为空');
    } else if (addForm.value.dictType == '') {
      message.error('字典类型不能为空');
    } else {
      if (!showEdit.value) {
        const { data } = await addDictData(addForm.value);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          // getDictTypeAll();
          getDict();
        } else {
          message.error('保存失败，请检查');
        }
      } else {
        const { data } = await editDictData(addForm.value);
        if (data.code === 200) {
          showModel.value = false;
          message.success('保存成功');
          // getDictTypeAll();
          getDict();
        } else {
          message.error('保存失败，请检查');
        }
      }
    }
  };

  const seekData = () => {
    if (current.value === 1) {
      getDict();
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
    showEdit.value = false;
    addForm.value = {};
    addForm.value.dictValue = '';
    addForm.value.dictLabel = '';
    addForm.value.dictType = '';
    addForm.value.dictDesc = '';
    addForm.value.dictSort = '';
    addForm.value.remarks = '';
  };

  const addValue = ref(false);
  const deployRole = (val) => {
    addForm.value = {};
    addForm.value.dictValue = '';
    addForm.value.dictValue = '';
    addForm.value.dictType = val.dictType;
    addForm.value.dictDesc = val.dictDesc;
    addForm.value.dictSort = val.dictSort + 10;
    addForm.value.remarks = '';
    addValue.value = true;
    showModel.value = true;
  };

  const showEdit = ref(false);
  const editData = (val) => {
    showModel.value = true;
    showEdit.value = true;
    addForm.value = val;
  };
  watch(showModel, () => {
    if (!showModel.value) {
      showEdit.value = false;
      addValue.value = true;
    }
  });
  const delData = async (val) => {
    const { data } = await delDictData(val.dictId);
    if (data.code === 200) {
      // getDictTypeAll();
      message.success('已经删除');
      getDict();
    }
  };
  const current = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  watch(pageSize, () => {
    getDict();
  });
  watch(current, () => {
    getDict();
  });
  onMounted(() => {
    getDict();
    // getDictTypeAll();
  });
  const spinning = ref(false);
  const getDict = async () => {
    spinning.value = true;
    const { data } = await getDictListData(
      current.value,
      pageSize.value,
      searchData.value.dictType.value,
      searchData.value.labelName.value,
    );
    tableData.value = data.data.records;
    total.value = data.data.total;
    spinning.value = false;
  };
  // const getDictTypeAll = async () => {
  // const { data } = await dictAllTypeApi();
  // if (data.code == 200) {
  //   data.data.forEach((item) => {
  //     searchData.value[0].options.push({
  //       id: item,
  //       name: item,
  //     });
  //   });
  // }
  // };
</script>
<style scoped>
  .dict_body {
    margin-top: 12px;
    width: 100%;
  }
</style>
