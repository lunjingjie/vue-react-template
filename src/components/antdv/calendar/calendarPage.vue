<!--
 * @Descripttion: your project
 * @version: 1.0
 * @Author: Aidam_Bo
 * @Date: 2023-07-17 15:17:53
 * @LastEditors: Aidam_Bo
 * @LastEditTime: 2023-07-17 15:18:09
-->
<template>
  <a-date-picker format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" v-bind="attrs">
    // eslint-disable-next-line vue/no-unused-vars, vue/no-unused-vars
    <template #dateRender="{ current, today }">
      <div class="ant-picker-cell-inner">
        <div v-if="dayjs(current).format('YYYY-MM-DD') != dayjs(today).format('YYYY-MM-DD')">
          {{ dayjs(current).format('D') }}
        </div>
        <div v-else class="ant-picker-cell-inner">
          {{ dayjs(current).format('D') }}
        </div>
        <div
          style="font-size: 10px; opacity: 0.6; color: #f90"
          v-if="getLunarDate(current)['lunarFestival']"
        >
          {{ getLunarDate(current)['lunarFestival'] }}
        </div>
        <div style="font-size: 10px; opacity: 0.6" v-else>
          {{
            getLunarDate(current)['IDayCn'] == '初一' &&
            getLunarDate(current)['IMonthCn'].indexOf('闰') > -1
              ? getLunarDate(current)['IMonthCn']
              : getLunarDate(current)['IDayCn']
          }}
        </div>
      </div>
    </template>
  </a-date-picker>
</template>
<script>
  export default {
    name: 'calendarName',
    inheritAttrs: false,
  };
</script>
<script setup name="CSelect">
  import dayjs from 'dayjs';
  import calendarFormatter from '@/utils/traditionalCalendar.js';
  import { useAttrs } from 'vue';
  const attrs = useAttrs();
  const getLunarDate = (current) => {
    // 日历控件使用含有农历和一些节假日
    // 1.引入 dayjs 和 calendarFormatter 文件
    // 2.调用 getLunarDate方法
    let year = dayjs(current).format('YYYY') * 1;
    let month = dayjs(current).format('M') * 1;
    let day = dayjs(current).format('D') * 1;
    return calendarFormatter.solar2lunar(year, month, day);
  };
</script>
