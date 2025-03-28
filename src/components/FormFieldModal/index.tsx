import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import type { FormField } from '@/models/diploma';

interface FormFieldModalProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => Promise<void>;
  initialValues?: FormField;
}

const FormFieldModal: React.FC<FormFieldModalProps> = ({
  visible,
  onCancel,
  onFinish,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onFinish(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Sửa trường thông tin' : 'Thêm trường thông tin'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form
        form={form}
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
          name="displayName"
          label="Tên hiển thị"
          rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dataType"
          label="Kiểu dữ liệu"
          rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
        >
          <Select>
            <Select.Option value="string">Text</Select.Option>
            <Select.Option value="number">Number</Select.Option>
            <Select.Option value="date">Date</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="isRequired"
          label="Bắt buộc"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormFieldModal;