import { isFunction } from '@/utils/is';

const bgColor = '#fff';
export const color = ['#0090FF', '#36CE9E', '#FFC005', '#FF515A', '#8B5CFF', '#00CA69'];

export const setLineOptions = (chart, xAxisData, legend, series, options = {}) => {
  const option = {
    backgroundColor: bgColor,
    color,
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          title: '保存图片',
        },
      },
    },
    legend: Array.isArray(legend)
      ? {
          show: true,
          type: 'scroll',
          data: legend,
          width: '70%',
        }
      : { ...legend, type: 'scroll', width: '70%' },
    dataZoom: options.dataZoom
      ? [
          {
            show: true,
            realtime: true,
          },
          {
            type: 'inside',
            realtime: true,
          },
        ]
      : [],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      extraCssText:
        'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
    },
    axisPointer: {
      link: { xAxisIndex: 'all' },
      label: {
        backgroundColor: '#777',
      },
    },
    grid: {
      top: 50,
      left: 70,
      right: 50,
      bottom: 70,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#D9D9D9',
          },
        },
        data: xAxisData,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: options.yAxisName ? options.yAxisName : '单位：mg/L',
        axisLabel: {
          textStyle: {
            color: '#666',
            fontSize: 12,
          },
        },
        nameTextStyle: {
          color: '#666',
          fontSize: 12,
          fontWeight: 'bold',
          lineHeight: 40,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E9E9E9',
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series,
  };
  if (options.otherYAxis) {
    option.yAxis.push(...options.otherYAxis);
  }
  if (options.filename) {
    option.toolbox.feature.saveAsImage.name = options.filename;
  }
  chart.setOption(option, true);
};

export const setPieOptions = (chart, legend, seriesData, options = {}) => {
  const option = {
    color: options.color || color,
    grid: {
      top: 0,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      left: 'center',
      data: legend,
    },
    series: [
      {
        name: '分布',
        type: 'pie',
        radius: '55%',
        center: ['50%', '40%'],
        selectedMode: 'single',
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  chart.setOption(option, true);
};

// 竖向柱状图
export const setVerticalBartOptions = (charts, xAxisData, series, { tooltipFormatter } = {}) => {
  const option = {
    color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: 10,
    },
    grid: {
      top: 0,
      left: '3%',
      right: 50,
      bottom: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: xAxisData,
    },
    series,
  };
  if (isFunction(tooltipFormatter)) {
    option.tooltip.valueFormatter = tooltipFormatter;
  }
  charts.setOption(option, true);
};

export const setMarklineBar = (charts, legend, xAxis, series) => {
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: legend,
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true, title: '保存图片' },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: xAxis,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series,
  };
  charts.setOption(option, true);
};

export const hexToRgba = (hex, opacity) => {
  let rgbaColor = '';
  const reg = /^#[\da-f]{6}$/i;
  if (reg.test(hex)) {
    rgbaColor = `rgba(${parseInt(`0x${hex.slice(1, 3)}`, 16)},${parseInt(
      `0x${hex.slice(3, 5)}`,
      16,
    )},${parseInt(`0x${hex.slice(5, 7)}`, 16)},${opacity})`;
  }
  return rgbaColor;
};
