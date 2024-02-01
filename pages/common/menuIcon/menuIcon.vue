<!--
 * @Descripttion: 添加图标，所有需要选择图标的可以引入此组件
 * @version: 1.0
 * @Author: zlx
 * @Date: 2023-02-18 11:11:29
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2023-02-20 15:59:58
-->
<template>
  <a-card title="选择图标" style="width: 300px; height: 330px" v-show="flagShow">
    <a-row type="flex" class="box">
      <a-col
        :span="4"
        :order="4"
        v-for="(item, index) in formState.iconList"
        :key="index"
        :style="{ background: item.bgColor !== undefined ? item.bgColor : '' }"
        style="cursor: pointer"
        @click="selectIcon(item)"
      >
        <component :is="$antdVueIcons[item.value]" />
      </a-col>
    </a-row>
    <div
      style="
        text-align: right;
        padding-right: 10px;
        padding-top: 10px;
        border-top: 1px solid #eff2f5;
        margin-top: 20px;
      "
    >
      <a-button type="primary" size="small" @click="comfirm()">确定</a-button>
      <a-button size="small" style="margin-left: 10px" @click="concel()">取消</a-button>
    </div>
  </a-card>
</template>
<script setup>
  /*
  组件使用方法
   父组件中添加 icon组件
   <menu-icon :flagShow="parentMsg" @getIconValue="getIconValue" />
    import menuIcon from '@/pages/common/menuIcon/menuIcon.vue';
     import { reactive } from 'vue';
    定义值
    const list = reactive({
      flagShow: false,
      IconValue: '',
    });
    const parentMsg = ref(list.flagShow);
    触发某个事件打开icon弹框
    const getIcon = () => {
      // 打开icon组件
      list.flagShow = true;
      parentMsg.value = list.flagShow;
    };
    取值
    const getIconValue = (val) => {
      console.log(val);
      if (val.flag !== undefined) {
        parentMsg.value = val.flag;
      }
      if (val.value !== undefined) {
        list.IconValue = val.value;
      }
    };
*/
  import { reactive, onMounted, defineProps, toRefs } from 'vue';
  import * as antdVueIcons from '@ant-design/icons-vue';
  // 子组件接收父组件的值
  const porps = defineProps({
    flagShow: Boolean,
  });
  // eslint-disable-next-line no-unused-vars
  let { flagShow } = toRefs(porps);
  const formState = reactive({
    iconList: [],
    originoIconList: [],
    selectValue: '', // 选中的值
  });
  const emit = defineEmits(['getIconValue']);
  onMounted(async () => {
    formState.iconList = [];
    for (const key in antdVueIcons) {
      if (Object.hasOwnProperty.call(antdVueIcons, key)) {
        if (antdVueIcons[key].displayName !== undefined) {
          formState.iconList.push({ value: key });
          formState.originoIconList.push({ value: key });
        }
      }
    }
  });
  const selectIcon = (item) => {
    // 每点击一次图标就清空之前的选项
    formState.iconList.forEach((res, index) => {
      if (res === item) {
        formState.iconList[index].bgColor = '#E7EAED';
      } else {
        formState.iconList[index].bgColor = '';
      }
    });
    formState.selectValue = item.value;
  };
  // 确定后将值传递出去 并关闭弹框
  const comfirm = () => {
    formState.selectValue = false;
    const param = {
      value: formState.selectValue,
      flag: false,
    };
    emit('getIconValue', param);
  };
  // 取消 关闭弹框
  const concel = () => {
    //  清空选项
    formState.selectValue = false;
    formState.iconList = formState.originoIconList;
    const param = {
      flag: false,
    };
    emit('getIconValue', param);
  };
</script>
<style scoped>
  .box {
    overflow-y: auto;
    overflow-x: hidden;
    width: 250px;
    height: 200px;
    text-align: center;
  }
  ::v-deep .ant-card-head-title {
    padding: 5px;
  }
  ::v-deep .ant-card-head {
    min-height: 30px;
  }
</style>
