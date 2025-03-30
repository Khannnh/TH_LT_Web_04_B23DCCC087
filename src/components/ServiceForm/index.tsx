import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Select } from 'antd';
import type { Service } from '@/models/service';
import styles from './index.less';

const { TextArea } = Input;

interface ServiceFormProps {
  initialValues?: Partial<Service>;
  categories: string[];
  onFinish: (values: any) => void;
  loading?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialValues,
  categories,
  onFinish,
  loading,
}) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        active: true,
        ...initialValues,
      }}
      className={styles.serviceForm}
    >
      <Form.Item
        name="name"
        label="Tên dịch vụ"
        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá (VNĐ)"
        rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ' }]}
      >
        <InputNumber
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="duration"
        label="Thời gian thực hiện (phút)"
        rules={[{ required: true, message: 'Vui lòng nhập thời gian thực hiện' }]}
      >
        <InputNumber min={1} max={480} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="category" label="Danh mục">
        <Select placeholder="Chọn danh mục">
          {categories.map((category) => (
            <Select.Option key={category} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="image" label="URL hình ảnh">
        <Input />
      </Form.Item>

      {initialValues?.image && (
        <div className={styles.imagePreview}>
          <img key={initialValues.image} src={initialValues.image} alt={initialValues.name} />
        </div>
      )}

      <Form.Item name="active" valuePropName="checked" label="Trạng thái hoạt động">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};