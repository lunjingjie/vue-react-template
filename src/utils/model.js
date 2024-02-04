import { createVNode } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

export const showDeleteConfirm = ({ title, description, successCb, cancelCb }) => {
  Modal.confirm({
    title: title || '确定删除该记录吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: description,
    okText: '确定',
    okType: 'primary',
    cancelText: '取消',
    async onOk() {
      if (!successCb) {
        return;
      }
      try {
        const promiseResult = await successCb();
        message.success('删除成功!');
        return promiseResult;
      } catch (error) {
        message.error('删除失败!');
        console.log(error);
      }
    },
    onCancel() {
      cancelCb && cancelCb();
    },
  });
};
