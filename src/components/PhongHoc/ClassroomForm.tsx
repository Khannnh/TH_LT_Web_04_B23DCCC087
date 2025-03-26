import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { Classroom } from '@/models/phonghoc/classroom';

interface ClassroomFormProps {
  initialValues?: Classroom;
  onSubmit: (values: Omit<Classroom, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const { Option } = Select;

const managers = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
  'Phạm Thị D',
  'Hoàng Văn E',
];

const ClassroomForm: React.FC<ClassroomFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="roomCode"
        label="Mã phòng"
        rules={[
          { required: true, message: 'Vui lòng nhập mã phòng' },
          { max: 10, message: 'Mã phòng không được quá 10 ký tự' },
        ]}
      >
        <Input disabled={!!initialValues} />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên phòng"
        rules={[
          { required: true, message: 'Vui lòng nhập tên phòng' },
          { max: 50, message: 'Tên phòng không được quá 50 ký tự' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Số chỗ ngồi"
        rules={[{ required: true, message: 'Vui lòng nhập số chỗ ngồi' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="type"
        label="Loại phòng"
        rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
      >
        <Select>
          <Option value="Lý thuyết">Lý thuyết</Option>
          <Option value="Thực hành">Thực hành</Option>
          <Option value="Hội trường">Hội trường</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="manager"
        label="Người phụ trách"
        rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
      >
        <Select>
          {managers.map(manager => (
            <Option key={manager} value={manager}>
              {manager}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ClassroomForm;
