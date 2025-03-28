import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import DiplomaBookForm from '@/components/DiplomaBookForm';
import type { DiplomaBook } from '@/models/diploma';
import { diplomaBookService } from '@/services/diploma';

const DiplomaBookPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  const handleAdd = async (values: any) => {
    setLoading(true);
    try {
      await diplomaBookService.create(values);
      message.success('Tạo sổ văn bằng thành công');
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('Tạo sổ văn bằng thất bại');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Năm',
      dataIndex: 'year',
    },
    {
      title: 'Tên sổ',
      dataIndex: 'name',
    },
    {
      title: 'Số hiện tại',
      dataIndex: 'currentSequence',
    },
    // ...other columns
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<DiplomaBook>
          actionRef={actionRef}
          columns={columns}
          request={async () => {
            const data = await diplomaBookService.getAll();
            return {
              data,
              success: true,
              total: data.length
            };
          }}
          rowKey="id"
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              onClick={() => setModalVisible(true)}
              icon={<PlusOutlined />}
            >
              Thêm sổ mới
            </Button>
          ]}
        />

        <Modal
          title="Thêm sổ văn bằng mới"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <DiplomaBookForm
            onFinish={handleAdd}
            loading={loading}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default DiplomaBookPage;