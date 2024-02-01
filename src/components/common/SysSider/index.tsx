import { Layout, Menu } from 'antd';
import { useSelector } from 'react-redux';
import { SYSTEM } from '../../../constants';
import { MailOutlined } from '@ant-design/icons';
import { routerList } from '../../../util/router';
const { Sider } = Layout;

export const SysSider: React.FC = () => {
  const systemTheme = useSelector((state: any) => state.system.theme);
  const collapsed = useSelector((state: any) => state.system.collapsed);
  // side和menu背景颜色
  const sideBackgroundColor = SYSTEM.primaryColor;
  const sideBackgroundColorDark = '#141414';

  const menuItems = routerList.map((item) => ({
    key: item.path,
    label: item.name,
    icon: <MailOutlined />,
    children: [
      {
        key: item.path,
        label: item.name,
        icon: <MailOutlined />,
      },
    ],
  }));

  const clickMenu = (e: any) => {
    window.location.hash = e.key;
  };

  return (
    <Sider
      id="sider"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflowY: 'auto',
        backgroundColor: systemTheme === 'dark' ? sideBackgroundColorDark : sideBackgroundColor,
        width: '208px',
        boxShadow: '2px 0 8px rgba(29,35,41,.05)',
      }}
    >
      <div className="logo">{collapsed ? 'LOGO' : SYSTEM.title}</div>
      <Menu
        theme={systemTheme}
        defaultSelectedKeys={['/basic1']}
        items={menuItems}
        onClick={clickMenu}
        mode="inline"
        style={{
          backgroundColor: systemTheme === 'dark' ? sideBackgroundColorDark : sideBackgroundColor,
          color: '#fff',
        }}
      />
    </Sider>
  );
};
