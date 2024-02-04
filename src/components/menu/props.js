import { MenuModeConstant } from '@/constants/menuConstant';

export const contentProps = {
  item: {
    type: Object,
    default: null,
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  isHorizontal: {
    type: Boolean,
    default: true,
  },
};

export const itemProps = {
  item: {
    type: Object,
    default: {},
  },
  level: Number,
  showTitle: Boolean,
  isHorizontal: Boolean,
};

export const basicProps = {
  items: {
    type: Array,
    default: () => [],
  },
  inlineIndent: {
    type: Number,
    default: 20,
  },
  // 菜单组件的mode属性
  mode: {
    type: String,
    default: MenuModeConstant.INLINE,
  },

  type: {
    type: String,
  },
  isHorizontal: {
    type: Boolean,
    default: true,
  },
};
