<template>
  <div>使用时替换接口，打开注释</div>
  <!-- <a-tree-select
    style="width: 200px"
    :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
    :tree-data="treeData"
    placeholder="区域选择"
    :load-data="isHasNextLevel ? onLoadData : null"
    show-search
    allow-clear
    v-bind="attrs"
    tree-node-filter-prop="areaName"
    :field-names="{
      children: 'children',
      label: 'areaName',
      value: 'areaId',
    }"
    :treeCheckable="multiple"
    :value="!multiple ? requestValue : multiValues"
  /> -->
</template>
<script>
  export default {
    name: 'AreaSelect',
    inheritAttrs: false,
  };
</script>
<script setup name="AreaSelect">
  // import { useAttrs, ref, onMounted, watch, computed } from 'vue';
  // import { getAreaListApi, getAreaInfoByIdApi } from '@/api/area';
  // import { message as Message } from 'ant-design-vue';
  // import { useLoginStore } from '@/stores/login';

  // const props = defineProps({
  //   value: {
  //     type: [String, Array],
  //   },
  //   multiple: {
  //     type: Boolean,
  //     default: false,
  //   },
  // });

  // const loginStore = useLoginStore();

  // const attrs = useAttrs();
  // const treeData = ref([]);

  // const requestValue = ref(''); // 单选时value
  // const multiValues = ref([]); // 多选时value

  // const isHasNextLevel = ref(true); // 是否拥有下一级行政区

  // // 获取租户配置的区域信息
  // const areaId = computed(() => {
  //   return loginStore.areaId ? loginStore.areaId : 0;
  // });

  // const getAreaTreeData = async ({ pAreaId }) => {
  //   const { data } = await getAreaListApi({ pAreaId });
  //   if (data.code === 200) {
  //     // 判断是否有下一级行政区
  //     if (data.data.length && data.data[0].areaType === '5') {
  //       isHasNextLevel.value = false;
  //     } else {
  //       isHasNextLevel.value = true;
  //     }
  //     treeData.value = data.data;
  //   }
  // };

  // const emits = defineEmits(['getData']);
  // const onLoadData = async (treeNode) => {
  //   setTimeout(async () => {
  //     const { areaId, pAreaId } = treeNode.dataRef;
  //     const { data } = await getAreaListApi({ pAreaId: areaId });
  //     if (data.code === 200) {
  //       // 递归查找areaId，添加数组到children
  //       const target = findNodeById(treeData.value, areaId);
  //       target.children = data.data;
  //       emits('getData', target.children);
  //     } else {
  //       const { data: res } = await getAreaListApi({ pAreaId });
  //       const target = findNodeById(treeData.value, pAreaId);
  //       target.children = res.data.data;
  //       Message.error('加载失败');
  //     }
  //   }, 300);
  // };

  // const findNodeById = (treeData, areaId) => {
  //   for (let i = 0; i < treeData.length; i += 1) {
  //     if (treeData[i].areaId === areaId) {
  //       return treeData[i];
  //     }
  //     if (treeData[i].children) {
  //       const node = findNodeById(treeData[i].children, areaId);
  //       if (node) {
  //         return node;
  //       }
  //     }
  //   }
  //   return null;
  // };

  // const getAreaInfoById = async (id) => {
  //   if (!id) {
  //     return;
  //   }
  //   const { data } = await getAreaInfoByIdApi(id);
  //   if (data && data.code === 200) {
  //     requestValue.value = data.data.areaName;
  //   } else {
  //     requestValue.value = props.value;
  //   }
  // };

  // const refreshData = () => {
  //   requestValue.value = '';
  // };

  // watch(
  //   () => props.value,
  //   () => {
  //     if (Array.isArray(props.value)) {
  //       multiValues.value = props.value;
  //       return;
  //     }
  //     if (!props.value) {
  //       requestValue.value = '';
  //       return;
  //     }
  //     getAreaInfoById(props.value);
  //   },
  // );

  // onMounted(() => {
  //   if (!Array.isArray(props.value)) {
  //     if (props.value) {
  //       // 用户初始化所选区域的显示
  //       getAreaInfoById(props.value);
  //     }
  //   }

  //   // 用于初始化整个区域树
  //   getAreaTreeData({ pAreaId: areaId.value });
  // });

  // defineExpose({
  //   refreshData,
  // });
</script>
