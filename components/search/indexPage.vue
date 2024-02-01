<template>
  <a-row style="line-height: 32px; box-sizing: border-box">
    <template v-for="(val, key) in props.searchData" :key="key">
      <div style="margin-left: 10px; margin-bottom: 10px" v-if="val.type === 'input'">
        <span v-if="val.prompt" class="prompt">{{ val.prompt }}：</span>
        <a-input
          v-model:value="val.value"
          :placeholder="val.placeholder"
          :style="{
            width: val.width ? val.width : '200px',
            'margin-bottom': '5px',
          }"
          allow-clear
        />
      </div>
      <div style="margin-left: 10px; margin-bottom: 10px" v-else-if="val.type === 'select'">
        <span v-if="val.prompt" class="prompt">{{ val.prompt }}：</span>
        <a-select
          ref="select"
          v-model:value="val.value"
          showSearch
          :style="{
            width: val.width ? val.width : '200px',
            'margin-bottom': '5px',
          }"
          :options="val.options"
          :placeholder="val.placeholder"
          :fieldNames="val.fieldNames ? val.fieldNames : {}"
          :mode="val.mode ? val.mode : null"
          allowClear
        ></a-select>
      </div>
      <div style="margin-left: 10px; margin-bottom: 10px" v-else-if="val.type == 'dataTimerange'">
        <span v-if="val.prompt" class="prompt">{{ val.prompt }}：</span>
        <a-range-picker
          v-model:value="val.value"
          :format="val.format"
          :locale="locale"
          :style="{
            width: val.width ? val.width : '200px',
            'margin-bottom': '5px',
          }"
          :value-format="val.valueFormat"
          :placeholder="val.placeholder"
        />
      </div>
    </template>
    <CBtn :showType="BTN_TYPE.search" class="mx-2" @click="$emit('seekData')">查询</CBtn>
    <CBtn
      :showType="BTN_TYPE.download"
      class="mx-2"
      v-if="props.isExport"
      @click="$emit('clickExport')"
      >导出Excel</CBtn
    >
  </a-row>
</template>

<script setup>
  const props = defineProps({
    searchData: Array,
    sizeNumber: Number,
    isExport: Boolean,
  });
</script>

<style scoped>
  .button-style {
    background-color: #e0ebfa;
    color: #1075ed;
    border-radius: 3px;
    border: 1px solid #b5cef4;
  }
  .button-style:hover {
    background-color: #40a9ff;
    color: #ffffff;
  }
</style>
