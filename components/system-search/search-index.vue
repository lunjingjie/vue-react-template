<template>
  <div>
    <div class="search_card">
      <!-- <div class="search_title">
        <BlockOutlined class="search_title_icon" />
        <a-breadcrumb separator=">">
          <a-breadcrumb-item>系统管理</a-breadcrumb-item>
          <a-breadcrumb-item>{{ props.title }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div> -->
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="(val, key) in props.searchData"
          :key="key"
          style="display: flex; line-height: 26px; margin-right: 16px; margin-bottom: 12px"
        >
          <span class="search_card_text">{{ val.name }}</span>
          <a-select
            v-model:value="val.value"
            style="width: 150px"
            :placeholder="val.placeholder"
            allowClear
            v-if="val.type == 'select'"
            show-search
            class="search_input"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
            <a-select-option v-for="item in val.options" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-input
            v-model:value="val.value"
            :placeholder="val.placeholder"
            allowClear
            style="width: 150px"
            v-if="val.type == 'input'"
            class="search_input"
          />
          <a-space direction="vertical">
            <a-date-picker
              v-model:value="val.value"
              :placeholder="val.placeholder"
              style="width: 150px"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :allowClear="false"
              :locale="locale"
              v-if="val.type == 'dataTime'"
            />
          </a-space>
          <a-range-picker
            v-model:value="val.value"
            :format="val.format"
            :locale="locale"
            :value-format="val.valueFormat"
            :placeholder="val.placeholder"
            v-if="val.type == 'dataTimerange'"
          />
          <a-cascader
            v-model:value="val.value"
            :options="val.options"
            change-on-select
            style="width: 150px"
            v-if="val.type == 'cascader'"
            :placeholder="val.placeholder"
            :fieldNames="val.fieldNames"
          >
            <template #tagRender="data">
              <a-tag :key="data[val.fieldNames[label]]" color="blue">{{
                data[val.fieldNames[label]]
              }}</a-tag>
            </template>
          </a-cascader>
        </div>
        <CBtn :showType="BTN_TYPE.search" class="mx-1" @click="$emit('seekData')"></CBtn>
        <!-- <div class="system_ui_btn" @click="$emit('seekData')" style="margin-left: 12px">查询</div> -->
        <!-- <div
          class="system_ui_btn"
          @click="resetData"
          v-if="!noShowReset"
          style="margin-left: 12px; color: #d88a3d; background: #ffebc3"
          >重置</div
        > -->
        <CBtn :showType="BTN_TYPE.reset" @click="resetData" v-if="!noShowReset" class="mx-1"></CBtn>
        <CBtn
          :showType="BTN_TYPE.download"
          @click="$emit('download')"
          v-if="showDownload"
          class="mx-1"
        ></CBtn>
        <CBtn
          :showType="BTN_TYPE.config"
          @click="$emit('config')"
          v-if="showConfig"
          class="mx-1"
        ></CBtn>
        <!-- <div
          class="system_ui_btn"
          @click="$emit('addData')"
          v-if="isAdd"
          style="margin-left: 12px; background: #c9facd; color: #2eb272"
          >新增</div
        > -->
        <CBtn :showType="BTN_TYPE.add" class="mx-1" @click="$emit('addData')" v-if="isAdd"
          >新增</CBtn
        >
      </div>
    </div>
  </div>
</template>
<script setup>
  import { SearchOutlined, InteractionOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN.js';
  import 'dayjs/locale/zh-cn';
  // import CBtn from '@/components/antdv/Button/BasicBtn.vue';
  // import { BTN_TYPE } from '@/constants';
  {
    SearchOutlined;
    InteractionOutlined;
    PlusOutlined;
  }
  const props = defineProps({
    title: String,
    searchData: Object,
    isAdd: Boolean,
    noShowReset: Boolean,
    showConfig: Boolean,
    showDownload: Boolean,
  });
  const resetData = () => {
    // props.searchData.forEach((item) => {
    //   if (item.type != 'dataTime') {
    //     item.value = '';
    //   }
    // });
    for (const key in props.searchData) {
      if (Object.hasOwnProperty.call(props.searchData, key)) {
        if (props.searchData[key].type != 'dataTime') {
          // eslint-disable-next-line vue/no-mutating-props
          props.searchData[key].value = '';
        }
      }
    }
  };
</script>
<style scoped>
  .search_card {
    background: #fff;
    padding: 10px 24px 0;
    border-radius: 5px;
    box-shadow: 0 2px 3px #e3e5e8 !important;
    border: 1px solid #e3e5e8;
    /* margin-top: 12px; */
  }
  .search_title {
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    display: flex;
  }
  .search_title_icon {
    color: rgb(54, 115, 234);
    font-size: 18px;
    margin-right: 8px;
  }
  .search_card_text {
    font-size: 13px;
    margin-right: 12px;
    line-height: 32px;
    color: #afafaf;
  }
</style>
