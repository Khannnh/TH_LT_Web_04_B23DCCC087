import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DiplomaField } from '@/types/diploma';
import { useDiplomaFieldModel } from '@/models/diplomaField';

const { Option } = Select;

const DiplomaFields: React.FC = () => {
  const { items: fields, add, update, remove } = useDiplomaFieldModel();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<DiplomaField>();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const fieldData: DiplomaField = {
        id: editingField?.id || Date.now().toString(),
        name: values.name,
        dataType: values.dataType,
        isRequired: values.isRequired || false,
        createdAt: editingField?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (editingField) {
        await update(editingField.id, fieldData);
        message.success('Cập nhật trường thông tin thành công');
      } else {
        await add(fieldData);
        message.success('Tạo trường thông tin thành công');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingField(undefined);
    } catch (error) {
      message.error('Không thể lưu trường thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await remove(id);
      message.success('Xóa trường thông tin thành công');
    } catch (error) {
      message.error('Không thể xóa trường thông tin');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (dataType: string) => {
        switch (dataType) {
          case 'String':
            return 'Chuỗi ký tự';
          case 'Number':
            return 'Số';
          case 'Date':
            return 'Ngày tháng';
          default:
            return dataType;
        }
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'isRequired',
      key: 'isRequired',
      render: (isRequired: boolean) => (isRequired ? 'Có' : 'Không'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DiplomaField) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingField(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingField(undefined);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm trường mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={fields}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingField ? 'Sửa trường thông tin' : 'Thêm trường thông tin mới'}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingField(undefined);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dataType"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
          >
            <Select>
              <Option value="String">Chuỗi ký tự</Option>
              <Option value="Number">Số</Option>
              <Option value="Date">Ngày tháng</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isRequired"
            label="Bắt buộc"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingField ? 'Cập nhật' : 'Tạo'}
            </Button>
            <Button
              onClick={() => {
                setModalVisible(false);
                setEditingField(undefined);
              }}
              style={{ marginLeft: 8 }}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiplomaFields;
