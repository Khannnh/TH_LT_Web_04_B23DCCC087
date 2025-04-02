import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Modal, Space, Tag } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import useFormField from '@/models/useFormField';
import FormFieldModal from '@/components/FormFieldModal';

interface FormField {
  id: string;
  name: string;
  displayName: string;
  dataType: 'string' | 'number' | 'date';
  isRequired: boolean;
  orderIndex: number;
}

const TemplatesPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<FormField | undefined>();
  const { fields, loading, addField, updateField, deleteField } = useFormField();

  const dataTypeColors = {
    string: 'blue',
    number: 'green',
    date: 'orange',
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa trường này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        await deleteField(id);
        actionRef.current?.reload();
      },
    });
  };

  const columns = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'displayName',
      width: 200,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'dataType',
      width: 120,
      render: (_: unknown, record: FormField) => (
        <Tag key={record.id} color={dataTypeColors[record.dataType]}>
          {record.dataType.toUpperCase()}
        </Tag>
      ),
      valueEnum: {
        string: { text: 'Text' },
        number: { text: 'Number' },
        date: { text: 'Date' },
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'isRequired',
      width: 100,
      valueEnum: {
        true: { text: 'Có', status: 'Success' },
        false: { text: 'Không', status: 'Default' },
      },
    },
    {
      title: 'Thao tác',
      width: 180,
      render: (_: any, record: FormField) => (
        <Space key={record.id}>
          <Button
            type="link"
            onClick={() => {
              setEditingField(record);
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
        <ProTable
          actionRef={actionRef}
          columns={columns}
          dataSource={fields}
          rowKey="id"
          search={false}
          loading={loading}
          toolBarRender={() => [
            <Button
              key="add-field"
              type="primary"
              onClick={() => {
                setEditingField(undefined);
                setModalVisible(true);
              }}
              icon={<PlusOutlined />}
            >
              Thêm trường
            </Button>,
          ]}
        />

        <FormFieldModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingField(undefined);
          }}
          initialValues={editingField}
          onFinish={async (values) => {
            if (editingField) {
              await updateField(editingField.id, values);
            } else {
              await addField(values);
            }
            setModalVisible(false);
            actionRef.current?.reload();
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default TemplatesPage;
