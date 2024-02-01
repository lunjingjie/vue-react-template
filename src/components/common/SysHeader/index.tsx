import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useRef } from 'react';
import { FlexWrap } from '../../styles';
import { UserGuide } from '../UserGuide';
import { ThemeSwitch } from '../ThemeSwitch';
import CBreadcrumb from '../../antd/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { setCollapsed } from '../../../store/systemSlice';
import { SysAccount } from '../SysAccount';
const { Header } = Layout;

export const SysHeader: React.FC = () => {
  const collapsed = useSelector((state: any) => state.system.collapsed);
  const systemTheme = useSelector((state: any) => state.system.theme);

  const dispatch = useDispatch();

  const themeRef = useRef<any>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  const childRefs = {
    targetRef,
  };

  return (
    <Header
      style={{
        padding: '0 20px 0 0',
        height: 48,
        lineHeight: '48px',
        display: 'flex',
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        justifyContent: 'space-between',
        backgroundColor: systemTheme === 'dark' ? '#141414' : '#fff',
      }}
    >
      <div>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          style: { marginLeft: '20px', fontSize: '18px' },
          onClick: () => dispatch(setCollapsed(!collapsed)),
        })}
        <CBreadcrumb></CBreadcrumb>
      </div>
      <FlexWrap>
        <UserGuide themeRef={themeRef}></UserGuide>
        <ThemeSwitch forwardedRefs={childRefs} ref={themeRef}></ThemeSwitch>
        <SysAccount />
      </FlexWrap>
    </Header>
  );
};
