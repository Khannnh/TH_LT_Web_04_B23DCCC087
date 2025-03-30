
import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button } from 'antd';
import type { GraduationDecision, DiplomaBook } from '@/models/diploma';
import { diplomaBookService } from '@/services/diploma';

interface DecisionFormProps {
  initialValues?: Partial<GraduationDecision>;
  onFinish: (values: any) => void;
  loading?: boolean;
}

const DecisionForm: React.FC<DecisionFormProps> = ({
  initialValues,
  onFinish,
  loading,
}) => {
  const [form] = Form.useForm();
  const [books, setBooks] = useState<DiplomaBook[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      const data = await diplomaBookService.getAll();
      setBooks(data);
    };
    loadBooks();
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="decisionNumber"
        label="Số quyết định"
        rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="issueDate"
        label="Ngày ban hành"
        rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="bookId"
        label="Sổ văn bằng"
        rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
      >
        <Select>
          {books.map(book => (
            <Select.Option key={book.id} value={book.id}>
              {book.name} - {book.year}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="summary"
        label="Trích yếu"
        rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DecisionForm;