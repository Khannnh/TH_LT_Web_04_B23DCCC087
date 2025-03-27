import React from 'react';
import { Layout, Menu } from 'antd';
import { history, useLocation } from 'umi';
import {
  BookOutlined,
  FileTextOutlined,
  FileProtectOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import DiplomaBooks from '@/pages/DiplomaBooks';
import GraduationDecisions from '@/pages/GraduationDecisions';
import Diplomas from '@/pages/Diplomas';
import DiplomaSearch from '@/pages/DiplomaSearch';
import DiplomaFields from '@/pages/DiplomaFields';

const { Header, Content, Sider } = Layout;

const BasicLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/diploma-books',
      icon: <BookOutlined />,
      label: 'Quản lý sổ văn bằng',
      children: [
        {
          key: '/diploma-books',
          label: 'Danh sách sổ văn bằng',
        },
        {
          key: '/graduation-decisions',
          label: 'Quyết định tốt nghiệp',
        },
        {
          key: '/diplomas',
          label: 'Quản lý thông tin văn bằng',
        },
        {
          key: '/diploma-search',
          label: 'Tra cứu văn bằng',
        },
        {
          key: '/diploma-fields',
          label: 'Cấu hình biểu mẫu phụ lục văn bằng',
        },
      ],
    },
  ];

  const renderContent = () => {
    switch (location.pathname) {
      case '/diploma-books':
        return <DiplomaBooks />;
      case '/graduation-decisions':
        return <GraduationDecisions />;
      case '/diplomas':
        return <Diplomas />;
      case '/diploma-search':
        return <DiplomaSearch />;
      case '/diploma-fields':
        return <DiplomaFields />;
      default:
        return <DiplomaBooks />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => history.push(key)}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
