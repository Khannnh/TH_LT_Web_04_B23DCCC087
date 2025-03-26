import React from 'react';
import { Card, Typography } from 'antd';
import ClassroomList from '@/components/PhongHoc/ClassroomList';

const { Title } = Typography;

const ClassroomManagement: React.FC = () => {
  return (
    <div>
      <Card>
        <Title level={2}>Quản lý phòng học</Title>
        <ClassroomList />
      </Card>
    </div>
  );
};

export default ClassroomManagement;
