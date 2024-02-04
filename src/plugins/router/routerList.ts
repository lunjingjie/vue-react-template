const routeList = [
  //静态路由
  {
    path: '/login',
    name: 'loginPage',
    component: () => import('@/pages/common/login/loginPage.vue'),
    type: 'basic',
  },
  {
    path: '/panel',
    name: 'CustomPanel',
    component: () => import('@/pages/customPanel/CustomPanel.vue'),
    type: 'basic',
  },
  // 流域管理
  {
    path: '/basinRiver',
    name: 'BasinRiver',
    component: () => import('@/pages/systemSetting/baseSetting/basinRiverSetting/BasinRiver.vue'),
    type: 'basic',
  },
  // 字典管理
  {
    path: '/dictManage',
    name: 'DictManage',
    component: () => import('@/pages/systemSetting/systemManage/dictManage/DictManage.vue'),
    type: 'basic',
  },
  // 编码管理
  {
    path: '/codeManage',
    name: 'CodeManage',
    component: () => import('@/pages/systemSetting/systemManage/codeManage/CodeManage.vue'),
    type: 'basic',
  },
  // 部门管理
  {
    path: '/departmentManage',
    name: 'DepartmentManage',
    component: () =>
      import('@/pages/systemSetting/systemManage/departmentManage/DepartmentManage.vue'),
    type: 'basic',
  },
  // 用户管理
  {
    path: '/userManage',
    name: 'UserManage',
    component: () => import('@/pages/systemSetting/systemManage/userManage/UserManage.vue'),
    type: 'basic',
  },
  // 角色管理
  {
    path: '/roleManage',
    name: 'RoleManage',
    component: () => import('@/pages/systemSetting/systemManage/roleManage/RoleManage.vue'),
    type: 'basic',
  },
  // 菜单管理
  {
    path: '/menuManage',
    name: 'MenuManage',
    component: () => import('@/pages/systemSetting/systemManage/menuManage/MenuManage.vue'),
    type: 'basic',
  },
  // 租户管理
  {
    path: '/tenantManage',
    name: 'TenantManage',
    component: () => import('@/pages/systemSetting/systemManage/tenantManage/TenantManage.vue'),
    type: 'basic',
  },
  // 操作日志
  {
    path: '/operationLog',
    name: 'OperationManage',
    component: () =>
      import('@/pages/systemSetting/systemManage/operationManage/OperationManage.vue'),
    type: 'basic',
  },
  // 埋点日志
  {
    path: '/trackLog',
    name: 'TrackingManage',
    component: () => import('@/pages/systemSetting/systemManage/trackingManage/TrackingManage.vue'),
    type: 'basic',
  },
  {
    path: '/template',
    name: 'templatePage',
    component: () => import('@/pages/template/templatePage.vue'),
    type: 'basic',
  },
  {
    path: '/template2',
    name: 'templatePage2',
    component: () => import('@/pages/template/templatePage2.vue'),
    type: 'basic',
  },
  {
    path: '/systemAmendPw',
    name: 'amendPwPage',
    component: () => import('@/pages/common/amendPassword/amendPwPage.vue'),
    type: 'basic',
  },
  {
    path: '/incompatible',
    name: 'incompatible',
    component: () => import('@/components/incompatible/indexPage.vue'),
    type: 'basic',
  },
  {
    path: '/video',
    name: 'videoPage',
    component: () => import('@/pages/common/video/videoPage.vue'),
  },

  {
    path: '/500',
    name: '500Page',
    component: () => import('@/pages/common/500/500Page.vue'),
    type: 'basic',
  },
  {
    path: '/404',
    name: '404Page',
    component: () => import('@/pages/common/404/404Page.vue'),
    type: 'basic',
  },
  // { path: '/:catchAll(.*)', redirect: '/404', hidden: true },
];

export const basicRoutes = routeList.filter((item) => item.type === 'basic');

export default routeList;
