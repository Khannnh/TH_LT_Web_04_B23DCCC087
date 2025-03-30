
import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Alert, message } from 'antd';
import type { SearchCriteria } from '@/models/diploma';

interface DiplomaSearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  loading?: boolean; 
}

const DiplomaSearchForm: React.FC<DiplomaSearchFormProps> = ({
  onSearch,
  loading
}) => {
  const [form] = Form.useForm();
  const [filledFields, setFilledFields] = useState<number>(0);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const filled = Object.values(allValues).filter(v => v).length;
    setFilledFields(filled);
  };

  const handleFinish = (values: SearchCriteria) => {
    if (filledFields < 2) {
      message.error('Vui lòng nhập ít nhất 2 thông tin tìm kiếm');
      return;
    }
    onSearch(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
    >
      <Alert 
        message="Vui lòng nhập ít nhất 2 thông tin để tìm kiếm"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form.Item name="diplomaNumber" label="Số hiệu văn bằng">
        <Input />
      </Form.Item>

      <Form.Item name="sequenceNumber" label="Số vào sổ">
        <Input />
      </Form.Item>

      <Form.Item name="studentId" label="Mã sinh viên">
        <Input />
      </Form.Item>

      <Form.Item name="fullName" label="Họ và tên">
        <Input />
      </Form.Item>

      <Form.Item name="birthDate" label="Ngày sinh">
        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit"
          loading={loading}
          disabled={filledFields < 2}
        >
          Tìm kiếm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiplomaSearchForm;