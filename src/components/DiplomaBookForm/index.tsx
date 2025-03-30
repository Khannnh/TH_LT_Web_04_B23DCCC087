import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import type { DiplomaBook } from '@/models/diploma';

interface DiplomaBookFormProps {
  initialValues?: Partial<DiplomaBook>;
  onFinish: (values: any) => void;
  loading?: boolean;
}

const DiplomaBookForm: React.FC<DiplomaBookFormProps> = ({
  initialValues,
  onFinish,
  loading,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="year"
        label="Năm"
        rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="name" 
        label="Tên sổ"
        rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiplomaBookForm;