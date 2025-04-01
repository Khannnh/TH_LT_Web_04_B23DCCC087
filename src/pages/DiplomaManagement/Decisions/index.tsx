import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Modal, Space } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import DecisionForm from '@/components/DecisionForm'; // Tạo form tương tự như DiplomaBookForm
import { graduationDecisionService } from '@/services/diploma';
import type { GraduationDecision } from '@/models/diploma';
import { ProColumns } from '@ant-design/pro-table';  // Đảm bảo đã import đúng ProColumns

const { confirm } = Modal;

const DecisionsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDecision, setEditingDecision] = useState<GraduationDecision | null>(null);
  const actionRef = useRef<ActionType>();

  // Hàm thêm mới hoặc cập nhật quyết định tốt nghiệp
  const handleAddOrUpdate = async (values: any) => {
    setLoading(true);
    try {
      if (editingDecision) {
        await graduationDecisionService.update(editingDecision.id, values);
        message.success('Cập nhật quyết định tốt nghiệp thành công');
      } else {
        await graduationDecisionService.create(values);
        message.success('Tạo quyết định tốt nghiệp thành công');
      }
      setModalVisible(false);
      setEditingDecision(null);
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

  // Hàm xóa quyết định tốt nghiệp
  const handleDelete = async (id: string) => {
    confirm({       //hộp thoại xác nhận trong antd 
      title: 'Bạn có chắc muốn xóa quyết định này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await graduationDecisionService.delete(id);
          message.success('Xóa quyết định tốt nghiệp thành công');
          actionRef.current?.reload();
        } catch (error) {
          message.error('Xóa quyết định thất bại');
        }
      },
    });
  };

  // Cột bảng quyết định tốt nghiệp
  const columns: ProColumns<GraduationDecision>[] = [
    /*ProColumns là một phần trong Ant Design Pro Table 
    (một thư viện con của Ant Design) là một component mạnh mẽ giúp bạn dễ dàng 
    tạo các bảng dữ liệu với các tính năng như phân trang, sắp xếp, tìm kiếm, lọc
    và nhiều tính năng khác mà không cần phải viết quá nhiều mã.*/
    {
      title: 'Số quyết định',
      dataIndex: 'decisionNumber',
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: 'Trích yếu',
      dataIndex: 'summary',
      ellipsis: true,
    },
    {
      title: 'Sổ văn bằng năm',
      dataIndex: 'year', // Thay đổi từ 'bookYear' thành 'year'
      render: (text, record) => record.year, // Hiển thị trường 'year' từ `GraduationDecision`
    },
    {
      title: 'Thao tác',
      width: 180,
      render: (_: any, record: GraduationDecision) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingDecision(record);
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
        <ProTable<GraduationDecision>
          actionRef={actionRef}
          columns={columns}
          request={async () => {
            const data = await graduationDecisionService.getAll();
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
                setEditingDecision(null); // Không có quyết định nào được chỉnh sửa
                setModalVisible(true);
              }}
              icon={<PlusOutlined />}
            >
              Thêm quyết định
            </Button>,
          ]}
        />

        {/* Modal Thêm/Sửa quyết định tốt nghiệp */}
        <Modal
          title={editingDecision ? 'Cập nhật quyết định tốt nghiệp' : 'Thêm quyết định mới'}
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingDecision(null);
          }}
          footer={null}
        >
          <DecisionForm
            onFinish={handleAddOrUpdate}
            loading={loading}
            initialValues={editingDecision || {}}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default DecisionsPage;
