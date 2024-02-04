import introJs from 'intro.js/intro.js';
import 'intro.js/introjs.css';
import '@/assets/style/tour.scss';

const defaultOptions = {
  prevLabel: '上一步',
  nextLabel: '下一步',
  doneLabel: '欢迎使用',
  tooltipPosition: 'bottom' /* 引导说明框相对高亮说明区域的位置 */,
  hidePrev: 'true', // 隐藏第一步中的上一个按钮
  tooltipClass: '' /* 引导说明文本框的样式 */,
  highlightClass: '' /* 说明高亮区域的样式 */,
  exitOnOverlayClick: false /* 是否允许点击空白处退出 */,
  showStepNumbers: false /* 是否显示说明的数据步骤*/,
  keyboardNavigation: false /* 是否允许键盘来操作 */,
  showButtons: true /* 是否按键来操作 */,
  showBullets: true /* 是否使用点点点显示进度 */,
  showProgress: false /* 是否显示进度条 */,
  scrollToElement: true /* 是否滑动到高亮的区域 */,
  overlayOpacity: 0.3 /* 遮罩层的透明度 */,
  positionPrecedence: [
    'bottom',
    'top',
    'right',
    'left',
  ] /* 当位置选择自动的时候，位置排列的优先级 */,
  disableInteraction: false /* 是否禁止与元素的相互关联 */,
  hintPosition: 'top-middle',
};

export const useIntro = (steps) => {
  const startIntro = () => {
    introJs()
      .setOptions({ ...defaultOptions, ...steps })
      .start();
  };

  return {
    startIntro,
  };
};
