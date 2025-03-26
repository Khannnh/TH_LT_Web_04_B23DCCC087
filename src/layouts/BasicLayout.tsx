import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'umi';
import { TeamOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/classroom',
      icon: <TeamOutlined />,
      label: <Link to="/classroom">Quản lý phòng học</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
