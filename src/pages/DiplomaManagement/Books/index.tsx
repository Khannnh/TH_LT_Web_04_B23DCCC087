import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Modal, Space } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import DiplomaBookForm from '@/components/DiplomaBookForm';
import type { DiplomaBook } from '@/models/diploma';
import { diplomaBookService } from '@/services/diploma';

const { confirm } = Modal;

const DiplomaBookPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingBook, setEditingBook] = useState<DiplomaBook | null>(null);
  const actionRef = useRef<ActionType>();

  const handleAddOrUpdate = async (values: any) => {
    setLoading(true);
    try {
      if (editingBook) {
        await diplomaBookService.update(editingBook.id, values);
        message.success('Cập nhật sổ văn bằng thành công');
      } else {
        await diplomaBookService.create(values);
        message.success('Tạo sổ văn bằng thành công');
      }
      setModalVisible(false);
      setEditingBook(null);
      actionRef.current?.reload();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Có lỗi xảy ra');
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: 'Bạn có chắc muốn xóa sổ văn bằng này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await diplomaBookService.delete(id);
          message.success('Xóa sổ văn bằng thành công');
          actionRef.current?.reload();
        } catch (error) {
          message.error('Xóa sổ văn bằng thất bại');
        }
      },
    });
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
      title: 'Thao tác',
      width: 180,
      render: (_: any, record: DiplomaBook) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingBook(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
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
              total: data.length,
            };
          }}
          rowKey="id"
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setEditingBook(null);
                setModalVisible(true);
              }}
              icon={<PlusOutlined />}
            >
              Thêm sổ mới
            </Button>,
          ]}
        />

        <Modal
          title={editingBook ? 'Cập nhật sổ văn bằng' : 'Thêm sổ văn bằng mới'}
          visible={modalVisible} 
          onCancel={() => {
            setModalVisible(false);
            setEditingBook(null);
          }}
          footer={null}
        >
          <DiplomaBookForm
            onFinish={handleAddOrUpdate}
            loading={loading}
            initialValues={editingBook || {}}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default DiplomaBookPage;
