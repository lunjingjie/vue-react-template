import { defineStore } from 'pinia';
// import { getSessionValue } from '@/utils/hooks/system/useStorage';
import { ref } from 'vue';
// import { useRouter } from 'vue-router';

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref([
    {
      path: '/homepage',
      name: '首页',
      title: '首页',
      icon: 'ant-design:home-outlined',
    },
    {
      path: '/template',
      name: '测试',
      title: '测试',
      icon: 'ant-design:home-outlined',
    },
    {
      path: '/realTimeGis',
      name: 'GIS一张图',
      title: 'GIS一张图',
      icon: 'ant-design:global-outlined',
    },
    {
      path: '/dataCenter',
      name: '数据中心',
      title: '数据中心',
      icon: 'ion:grid-outline',
      children: [
        {
          path: '/board',
          route: '/board',
          icon: 'ant-design:database-outlined',
          title: '数据看板',
          name: '数据看板',
          // children: [
          //   {
          //     path: '/dataCenter/board/realTime',
          //     route: '/dataCenter/board/realTime',
          //     icon: 'ant-design:bank-filled',
          //     title: '实时数据',
          //     name: '实时数据',
          //   },
          //   {
          //     path: '/dataCenter/board/history',
          //     route: '/dataCenter/board/history',
          //     icon: 'ant-design:dashboard-outlined',
          //     title: '历史统计数据',
          //     name: '历史统计数据',
          //   },
          //   {
          //     path: '/dataCenter/board/curve',
          //     route: '/dataCenter/board/curve',
          //     icon: 'ant-design:alibaba-outlined',
          //     title: '曲线分析',
          //     name: '曲线分析',
          //   },
          //   {
          //     path: '/dataCenter/board/statistics',
          //     route: '/dataCenter/board/statistics',
          //     icon: 'ant-design:copy-outlined',
          //     title: '统计分析',
          //     name: '统计分析',
          //   },
          //   {
          //     path: '/dataCenter/board/reportForms',
          //     route: '/dataCenter/board/reportForms',
          //     icon: 'ant-design:bank-filled',
          //     title: '水质日历月度报表',
          //     name: '水质日历月度报表',
          //   },
          //   {
          //     path: '/dataCenter/board/quality',
          //     route: '/dataCenter/board/quality',
          //     icon: 'ant-design:snippets-outlined',
          //     title: '数据质量概况',
          //     name: '数据质量概况',
          //   },
          //   {
          //     path: '/dataCenter/board/contrast',
          //     route: '/dataCenter/board/contrast',
          //     icon: 'ant-design:align-left-outlined',
          //     title: '数据对比',
          //     name: '数据对比',
          //   },
          // ],
        },
        // {
        //   path: '/dataCenter/examine',
        //   route: '/dataCenter/examine',
        //   icon: 'ant-design:bulb-outlined',
        //   title: '数据审核',
        //   name: '数据审核',
        // },
      ],
    },
  ]);
  const menuArray = ref([]);
  const menuUrl = ref([]);
  // const menuList = ref(JSON.parse(getSessionValue('menuList')));
  const adminmenu = {
    data: [
      {
        url: '/template',
        name: '模板',
        children: [],
      },
      {
        url: '/systemAmendPw',
        name: 'systemAmendPw',
        children: [],
      },
      {
        url: '/admin',
        name: 'admin',
        children: [],
      },
      {
        url: '/video',
        name: 'video',
        children: [],
      },
    ],
  };
  const othermenu = {
    data: [
      {
        url: '/template',
        name: '模板',
        children: [],
      },
      {
        url: '/systemAmendPw',
        name: 'systemAmendPw',
        children: [],
      },
      {
        url: '/user',
        name: 'user',
        children: [],
      },
    ],
  };
  const addMenu = (menu) => {
    menuArray.value.push(menu);
    menuArray.value.forEach((item) => {
      item.forEach((value) => {
        menuUrl.value.push(value.url);
      });
    });
  };

  return { menuArray, menuList, menuUrl, adminmenu, othermenu, addMenu };
});
