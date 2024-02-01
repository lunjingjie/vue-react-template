import React, { useEffect } from 'react';
import { Layout, theme, ConfigProvider } from 'antd';
import './App.scss';
import { NavTab } from './components/common';
import { useSelector } from 'react-redux';
import { SysHeader } from './components/common/SysHeader';
import { SysSider } from './components/common/SysSider';
import { SysContent } from './components/common/SysContent';
import { SYSTEM } from './constants';

const App: React.FC = () => {
  const systemTheme = useSelector((state: any) => state.system.theme);

  // 初始化主题颜色样式
  useEffect(() => {
    document.documentElement.setAttribute('theme', 'light');
  }, []);

  return (
    <ConfigProvider
      theme={{
        // 1. 单独使用暗色算法
        algorithm: systemTheme === 'dark' ? theme.darkAlgorithm : [],
        token: {
          colorPrimary: SYSTEM.primaryColor,
        },
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <SysSider />
        <Layout className="site-layout">
          <SysHeader />
          <NavTab />
          <SysContent />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
