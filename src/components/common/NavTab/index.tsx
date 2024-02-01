import { Tabs } from "antd";
import { useState } from "react";
import './index.scss';

const initialItems = [
  { label: '平台概览', key: '1', closable: false },
  { label: '网关列表', key: '2' },
  {
    label: '报错信息',
    key: '3',
  },
];

export const NavTab: React.FC = () => {
  const [activeKey] = useState(initialItems[0].key);
  const [items] = useState(initialItems);

  return (
    <Tabs
      className="multi-tabs"
      type="editable-card"
      size="small"
      // onChange={onChange}
      activeKey={activeKey}
      // onEdit={onEdit}
      items={items}
      hideAdd={true}
    />
  );
}
