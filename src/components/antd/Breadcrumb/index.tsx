import React from 'react';
import { Breadcrumb } from 'antd';
import './index.scss';

const menuItems = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        General
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        Layout
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        Navigation
      </a>
    ),
  },
];

const CBreadcrumb: React.FC = () => (
  <Breadcrumb
    className='wrap'
    items={[
      {
        title: 'Ant Design',
      },
      {
        title: <a>Component</a>,
      },
      {
        title: <a>General</a>,
        menu: { items: menuItems },
      },
      {
        title: 'Button',
      },
    ]}
  />
);

export default CBreadcrumb;
