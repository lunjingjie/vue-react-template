<template>
  <div class="condition-wrap">
    <a-row style="line-height: 32px; box-sizing: border-box">
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span>菜单名称:</span>
        <a-input
          style="width: 200px; margin-left: 10px"
          v-model:value="fieldValue.functionName"
          allowClear
        ></a-input>
      </div>
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span>开始时间:</span>
        <a-date-picker
          :locale="locale"
          style="margin-left: 10px"
          v-model:value="fieldValue.beginTime"
          value-format="YYYY-MM-DD 00:00:00"
        />
      </div>
      <div style="margin-left: 10px; margin-bottom: 10px">
        <span>结束时间:</span>
        <a-date-picker
          :locale="locale"
          style="margin-left: 10px"
          v-model:value="fieldValue.endTime"
          value-format="YYYY-MM-DD 23:59:59"
        />
      </div>
      <CBtn :showType="BTN_TYPE.search" class="mx-2" @click="search"></CBtn>
    </a-row>
    <div
      :style="{ height: offsetHeight + 'px', 'max-height': offsetHeight + 'px' }"
      style="overflow-y: auto"
    >
      <a-row class="mt-5">
        <a-col span="8">
          <div style="font-weight: 700">
            <Icon icon="mdi:chart-pie" class="title-icon"></Icon>
            功能访问次数分布
          </div>
          <div id="countPie" style="height: 350px; margin-top: 20px; width: 98%"></div>
        </a-col>
        <a-col span="8">
          <div style="font-weight: 700">
            <Icon icon="mdi:format-list-numbered" class="title-icon"></Icon>
            功能访问次数排名
          </div>
          <div id="countBar" style="margin-top: 20px; width: 98%; height: 350px"></div>
        </a-col>
        <a-col span="8">
          <div style="font-weight: 700">
            <Icon icon="mdi:format-list-numbered" class="title-icon"></Icon>
            功能访问停留时间排名
          </div>
          <div id="timeBar" style="margin-top: 20px; width: 95%; height: 350px"></div>
        </a-col>
      </a-row>
      <a-divider></a-divider>
      <a-table
        :columns="headers"
        :data-source="dataSource"
        bordered
        size="middle"
        :pagination="false"
        style="height: 530px"
        :scroll="size > 10 ? { y: 470 } : {}"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'duration'">
            <span>{{ formatSecond(record[column.dataIndex]) }}</span>
          </template>
          <template v-else>
            <span>{{ record[column.dataIndex] === null ? '--' : record[column.dataIndex] }}</span>
          </template>
        </template>
      </a-table>
      <div style="display: flex; flex-direction: row; justify-content: end">
        <a-pagination
          style="margin-bottom: 10px"
          size="small"
          :total="total"
          v-model:current="current"
          v-model:pageSize="size"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条`"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, reactive, watch, onMounted } from 'vue';
  import { headers } from './headers';
  import { message as Message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { getTrackLogListApi, getChartDataApi } from '@/api/systemSetting/systemManage/trackLog';
  import { formatSecond } from '@/utils/time';
  import * as echarts from 'echarts/lib/echarts';
  import { BarChart, PieChart } from 'echarts/charts';
  import {
    TooltipComponent,
    ToolboxComponent,
    MarkLineComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
  } from 'echarts/components';
  import { setPieOptions, setVerticalBartOptions } from '@/utils/chart';
  import { deepClone } from '@/utils';

  echarts.use([
    BarChart,
    PieChart,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    MarkLineComponent,
    DataZoomComponent,
  ]);

  const dataSource = ref([]);

  const fieldValue = reactive({
    functionName: '',
    beginTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
    endTime: dayjs().format('YYYY-MM-DD 23:59:59'),
  });

  // 当前页码
  const current = ref(1);
  // 每页条数
  const size = ref(10);
  // 总条数
  const total = ref(0);

  const offsetHeight = ref(null);

  let countPie = null;
  let countBar = null;
  let timeBar = null;

  const formatChartData = async () => {
    const params = formatFieldParam({
      beginTime: fieldValue.beginTime,
      endTime: fieldValue.endTime,
    });
    const { data } = await getChartDataApi(params);
    if (!(data && data.code === 200)) {
      return;
    }

    // 按点击次数降序
    const countDataList = deepClone(data.data).sort((a, b) => b.clicknum - a.clicknum);
    setPieOptions(
      countPie,
      countDataList.map((item) => item.functionname).slice(0, 5),
      countDataList
        .map((item) => ({
          value: item.clicknum,
          name: item.functionname,
        }))
        .slice(0, 5),
    );

    const countBarSeries = [
      {
        name: '访问次数',
        type: 'bar',
        itemStyle: {
          borderRadius: [0, 5, 5, 0],
        },
        label: {
          show: true,
          formatter: '{c} 次',
          position: 'right',
        },
        barWidth: 10,
        data: countDataList
          .map((data) => data.clicknum)
          .slice(0, 10)
          .reverse(),
      },
    ];
    setVerticalBartOptions(
      countBar,
      countDataList
        .map((item) => item.functionname)
        .slice(0, 10)
        .reverse(),
      countBarSeries,
    );

    // 按累计时间降序
    const timeDataList = deepClone(data.data).sort((a, b) => b.duration - a.duration);
    const timeBarSeries = [
      {
        name: '累计停留时间',
        type: 'bar',
        itemStyle: {
          borderRadius: [0, 5, 5, 0],
        },
        label: {
          show: true,
          formatter: (val) => {
            return formatSecond(val.data);
          },
          position: 'right',
        },
        barWidth: 10,
        data: timeDataList
          .slice(0, 10)
          .map((data) => data.duration)
          .reverse(),
      },
    ];
    setVerticalBartOptions(
      timeBar,
      timeDataList
        .slice(0, 10)
        .map((item) => item.functionname)
        .reverse(),
      timeBarSeries,
      {
        tooltipFormatter: (value) => formatSecond(value),
      },
    );
  };

  const formatFieldParam = (fieldValue) => {
    const params = {};
    Object.keys(fieldValue).forEach((key) => {
      if (fieldValue[key] !== '' && fieldValue[key] !== null) {
        if (key === 'beginTime') {
          params[key] = dayjs(fieldValue[key]).format('YYYY-MM-DD 00:00:00');
        } else if (key === 'endTime') {
          params[key] = dayjs(fieldValue[key]).format('YYYY-MM-DD 23:59:59');
        } else {
          params[key] = fieldValue[key];
        }
      }
    });
    return params;
  };

  const getListByPage = async () => {
    if (fieldValue.beginTime && !fieldValue.endTime) {
      Message.warning('请选择结束时间');
      return;
    }
    if (!fieldValue.beginTime && fieldValue.endTime) {
      Message.warning('请选择开始时间');
      return;
    }
    if (dayjs(fieldValue.endTime).unix() < dayjs(fieldValue.beginTime).unix()) {
      Message.warning('结束时间不能小于开始时间');
      return;
    }
    const params = formatFieldParam(fieldValue);
    const { data } = await getTrackLogListApi({
      current: current.value,
      size: size.value,
      ...params,
    });
    dataSource.value = data.data.records;
    total.value = data.data.total;
  };

  const search = () => {
    if (current.value !== 1) {
      current.value = 1;
    } else {
      getListByPage();
      formatChartData();
    }
  };

  watch([current, size], () => {
    getListByPage();
  });

  onMounted(() => {
    offsetHeight.value = document.body.offsetHeight - 200;
    window.onresize = () => {
      return (() => {
        offsetHeight.value = document.body.offsetHeight - 200;
      })();
    };
    getListByPage();
    countPie = echarts.init(document.getElementById('countPie'), 'light');
    countBar = echarts.init(document.getElementById('countBar'), 'light');
    timeBar = echarts.init(document.getElementById('timeBar'), 'light');
    formatChartData();
  });
</script>
