import { createApp } from 'vue';
import 'virtual:windi.css';
import '@purge-icons/generated';
import { createPinia } from 'pinia';
import App from './App.vue';
import Antd from 'ant-design-vue';

import { initRouter } from '@/plugins/router';
import * as antdVueIcons from '@ant-design/icons-vue';
import AMapLoader from '@amap/amap-jsapi-loader';

import 'ant-design-vue/dist/reset.css';
import '@/assets/style/index.scss';

// import 'ant-design-vue/dist/antd.css';
// import '@/assets/modified.css';
// import '@/assets/scss/index.scss';
// import '@/assets/ui.css';
// // 对组件统一的样式
// import '@/assets/scss/common.scss';
// import 'animate.css';

// import '@/mock';
import { globalComponents } from './components/antdv';
import { BTN_TYPE } from '@/constants';
import * as directives from '@/directive';

import locale from 'ant-design-vue/es/date-picker/locale/zh_CN.js';
import 'dayjs/locale/zh-cn';
// import 'timeline-slider-vue/lib/timeline-slider-vue.css';

// // bpmn-js的字体库以及样式文件
// import 'bpmn-js/dist/assets/diagram-js.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
// import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
// //右边属性面板样式
// import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'; // 右边工具栏样式

window._AMapSecurityConfig = {
  securityJsCode: 'bcf65a6e234edcb101fe754dc6d04573',
};
function bootstrap() {
  const app = createApp(App);
  initRouter(app);
  app.use(createPinia());
  registerIconComponent(app);
  registerGlobalComponents(app);
  registerConstants(app);
  registerDirectives(app);
  app.use(Antd);
  app.use(AMapLoader);
  app.mount('#app');
}

/**
 * 注册icon组件
 */
function registerIconComponent(app) {
  Object.keys(antdVueIcons).forEach((key) => {
    app.component(key, antdVueIcons[key]);
  });
  app.config.globalProperties.$antdVueIcons = antdVueIcons;
}
/**
 * 注册自定义组件
 */
function registerGlobalComponents(app) {
  Object.keys(globalComponents).forEach((key) => {
    app.component(key, globalComponents[key]);
  });
}
/**
 * 注册全局变量
 */
function registerConstants(app) {
  app.config.globalProperties.BTN_TYPE = BTN_TYPE;
  app.config.globalProperties.locale = locale;
}

function registerDirectives(app) {
  Object.keys(directives).forEach((key) => {
    directives[key](app);
  });
}

bootstrap();
