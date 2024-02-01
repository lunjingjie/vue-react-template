import { createApp } from 'vue';
import 'virtual:windi.css';
import '@purge-icons/generated';
import { createPinia } from 'pinia';
import AppComponent from './App.vue';
import Antd from 'ant-design-vue';

import { initRouter } from '@/plugins/router';
import * as antdVueIcons from '@ant-design/icons-vue';

import 'ant-design-vue/dist/reset.css';
import '@/assets/style/index.scss';

import { globalComponents } from './components/antdv';
import { BTN_TYPE } from '@/constants';
import * as directives from '@/directive';

import locale from 'ant-design-vue/es/date-picker/locale/zh_CN.js';
import 'dayjs/locale/zh-cn';

import type { App, ComponentOptions, FunctionalComponent } from 'vue';

function bootstrap() {
  const app = createApp(AppComponent);
  initRouter(app);
  app.use(createPinia());
  registerIconComponent(app);
  registerGlobalComponents(app);
  registerConstants(app);
  registerDirectives(app);
  app.use(Antd);
  app.mount('#app');
}

/**
 * 注册icon组件
 */
function registerIconComponent(app: App<Element>) {
  Object.keys(antdVueIcons).forEach((key) => {
    app.component(key as keyof typeof antdVueIcons, antdVueIcons[key as keyof typeof antdVueIcons]);
  });
  app.config.globalProperties.$antdVueIcons = antdVueIcons;
}

const globalComponentsObj: Record<string, ComponentOptions<any> | FunctionalComponent<any>> =
  globalComponents;

/**
 * 注册自定义组件
 */
function registerGlobalComponents(app: App<Element>) {
  Object.keys(globalComponentsObj).forEach((key) => {
    app.component(key, globalComponentsObj[key]);
  });
}
/**
 * 注册全局变量
 */
function registerConstants(app: App<Element>) {
  app.config.globalProperties.BTN_TYPE = BTN_TYPE;
  app.config.globalProperties.locale = locale;
}

interface DirectiveRegistration {
  (app: App<Element>): void;
}

const directivesObj: Record<string, DirectiveRegistration> = directives;
function registerDirectives(app: App<Element>) {
  Object.keys(directivesObj).forEach((key) => {
    directivesObj[key](app);
  });
}

bootstrap();
