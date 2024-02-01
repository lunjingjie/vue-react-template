import { Dropdown, Space } from 'antd';
import { Icon } from '../Icon';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';

const AccountText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--account-text-color);
`;

const AccountIcon = styled.span`
  position: relative;
  top: 3px;
`;

const items: MenuProps['items'] = [
  {
    label: '操作手册',
    key: '0',
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: '1',
  },
];

export const SysAccount: React.FC = () => {
  return (
    <div className="header-comp">
      <Space>
        <AccountIcon>
          <Icon icon="mdi-account-circle"></Icon>
        </AccountIcon>
        <Dropdown menu={{ items }} trigger={['click']}>
          <span>
            <Space>
              <AccountText>Administrator</AccountText>
              <DownOutlined style={{ fontSize: '10px' }} />
            </Space>
          </span>
        </Dropdown>
      </Space>
    </div>
  );
};
