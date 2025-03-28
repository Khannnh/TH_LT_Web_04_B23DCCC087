import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Space, Modal, message, Tag, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Service } from '@/models/service';
import { getServices, createService, updateService, deleteService } from '@/services/service';
import ServiceForm from '@/components/ServiceForm';
import styles from './index.less';

const ServicesPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service>();
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  const handleAdd = () => {
    setSelectedService(undefined);
    setModalVisible(true);
  };

  const handleEdit = (record: Service) => {
    setSelectedService(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      message.success('Xóa dịch vụ thành công');
      actionRef.current?.reload();
    } catch (error) {
      message.error('Xóa dịch vụ thất bại');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (selectedService) {
        await updateService(selectedService.id, values);
        message.success('Cập nhật dịch vụ thành công');
      } else {
        await createService(values);
        message.success('Thêm dịch vụ thành công');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
    setLoading(false);
  };

  const columns: ProColumns<Service>[] = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: 100,
      render: (dom: React.ReactNode) => (
        dom ? (
          <Image
            src={String(dom)}
            alt="service"
            width={80}
            height={80}
            style={{ objectFit: 'cover' }}
          />
        ) : null
      ),
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      width: 150,
      render: (dom: React.ReactNode, entity: Service) => entity.price.toLocaleString('vi-VN'),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      width: 150,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 100,
      render: (_: React.ReactNode, entity: Service) => (
        <Tag color={entity.active ? 'success' : 'error'}>
          {entity.active ? 'Đang cung cấp' : 'Ngừng cung cấp'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
                onOk: () => handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div className={styles.tableToolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm dịch vụ
          </Button>
        </div>

        <ProTable<Service>
          actionRef={actionRef}
          columns={columns}
          request={async () => {
            const response = await getServices();
            return {
              data: response,
              success: true,
              total: response.length,
            };
          }}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          scroll={{ x: 1500 }}
        />

        <Modal
          title={selectedService ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <ServiceForm
            initialValues={selectedService}
            onFinish={handleSubmit}
            loading={loading}
            categories={['Cắt tóc', 'Nhuộm tóc', 'Spa', 'Massage']} // Cần lấy danh sách category từ API
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default ServicesPage;