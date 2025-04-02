import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Modal, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import DiplomaForm from '@/components/DiplomaForm';
import DiplomaDetail from '@/components/DiplomaDetail';
import type { Diploma } from '@/models/diploma';

const DiplomasPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | undefined>();
  const [loading, setLoading] = useState(false);

  const columns: ProColumns<Diploma>[] = [
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber',
      width: 150,
      search: true,
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'sequenceNumber',
      width: 120,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      width: 120,
      search: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      width: 200,
      search: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      width: 120,
      valueType: 'date' as const,
    },
    {
      title: 'Quyết định',
      dataIndex: 'decisionNumber',
      width: 150,
      render: (_: any, record: Diploma) => record.decisionId,
    },
    {
      title: 'Thao tác',
      width: 180,
      render: (_: any, record: Diploma) => (
        <Space key={record.id}>
          <Button 
            type="link" 
            onClick={() => {
              setSelectedDiploma(record);
              setDetailVisible(true);
            }}
          >
            Chi tiết
          </Button>
          <Button 
            type="link"
            onClick={() => {
              setSelectedDiploma(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<Diploma>
          actionRef={actionRef}
          columns={columns}
          request={async (params) => {
            const storedDiplomas = JSON.parse(localStorage.getItem('diplomas') || '[]') as Diploma[];
          
            const keyword = params.keyword || ''; // Nếu keyword là undefined, sử dụng chuỗi rỗng
          
            if (keyword) {
              const filteredDiplomas = storedDiplomas.filter(
                (diploma) =>
                  diploma.diplomaNumber.includes(keyword) ||
                  diploma.studentId.includes(keyword) ||
                  diploma.fullName.includes(keyword)
              );
              return {
                data: filteredDiplomas,
                success: true,
                total: filteredDiplomas.length,
              };
            }
          
            return {
              data: storedDiplomas,
              success: true,
              total: storedDiplomas.length,
            };
          }}
          
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              key="add-diploma"
              type="primary"
              onClick={() => {
                setSelectedDiploma(undefined);
                setModalVisible(true);
              }}
              icon={<PlusOutlined />}
            >
              Thêm văn bằng
            </Button>,
          ]}
        />

        <Modal
          title={selectedDiploma ? 'Chi tiết văn bằng' : 'Thêm văn bằng mới'}
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setSelectedDiploma(undefined);
          }}
          footer={null}
          width={800}
        >
          <DiplomaForm
            initialValues={selectedDiploma}
            onFinish={async (values) => {
              setLoading(true);
              try {
                if (selectedDiploma) {
                  // Cập nhật văn bằng trong localStorage
                  const diplomas = JSON.parse(localStorage.getItem('diplomas') || '[]') as Diploma[];
                  const updatedDiplomas = diplomas.map((diploma) =>
                    diploma.id === selectedDiploma.id ? { ...diploma, ...values } : diploma
                  );
                  localStorage.setItem('diplomas', JSON.stringify(updatedDiplomas));
                  message.success('Cập nhật văn bằng thành công');
                } else {
                  // Thêm mới văn bằng vào localStorage
                  const diplomas = JSON.parse(localStorage.getItem('diplomas') || '[]') as Diploma[];
                  const newDiploma = { id: String(Date.now()), ...values };
                  localStorage.setItem('diplomas', JSON.stringify([...diplomas, newDiploma]));
                  message.success('Thêm văn bằng thành công');
                }
                setModalVisible(false);
                actionRef.current?.reload();
              } catch (error) {
                message.error('Thao tác thất bại');
              }
              setLoading(false);
            }}
            loading={loading}
          />
        </Modal>

        <Modal
          title="Chi tiết văn bằng"
          visible={detailVisible}
          onCancel={() => {
            setDetailVisible(false);
            setSelectedDiploma(undefined);
          }}
          footer={null}
          width={800}
        >
          {selectedDiploma && (
            <DiplomaDetail diploma={selectedDiploma} />
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default DiplomasPage;
