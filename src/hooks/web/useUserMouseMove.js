import { isNumber } from '@/utils/is';
import { useLoginStore } from '@/stores/login';
import { getSessionValue, setSessionValue } from '@/utils/hooks/system/useStorage';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

export const confirmFunc = () => {
  const { loginOut } = useLoginStore();
  Modal.confirm({
    title: '系统提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '您已经长时间没有进行操作了，请重新登录',
    okText: '确认',
    centered: true,
    keyboard: false,
    cancelButtonProps: {
      disabled: true,
    },
    onOk: () => {
      loginOut();
    },
    onCancel: () => {
      loginOut();
    },
  });
};

/**
 * 判断用户是否在一段时间内没有移动鼠标
 * @param {number} second 秒数
 */
export const useUserMouseMove = (second) => {
  if (!isNumber(second)) {
    console.error('useUserMouseMove: second is not a number');
    return;
  }

  const time = second * 1000;
  let timer = null;

  const handleMouseMove = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (getSessionValue('token')) {
        window.removeEventListener('mousemove', handleMouseMove);
        // 设置标识，以防用户刷新操作
        setSessionValue('shouldLogout', true);
        confirmFunc();
      }
      clearTimeout(timer);
    }, time);
  };

  window.addEventListener('mousemove', handleMouseMove);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
};
