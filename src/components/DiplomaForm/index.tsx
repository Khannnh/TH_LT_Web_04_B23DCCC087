
import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button } from 'antd';
import type { Diploma, FormField, GraduationDecision, DiplomaBook } from '@/models/diploma';
import { diplomaBookService, graduationDecisionService, formFieldService } from '@/services/diploma';
import moment from 'moment';

interface DiplomaFormProps {
  initialValues?: Partial<Diploma>;
  onFinish: (values: any) => Promise<void>;
  loading?: boolean;
}

const DiplomaForm: React.FC<DiplomaFormProps> = ({
  initialValues,
  onFinish,
  loading
}) => {
  const [form] = Form.useForm();
  const [books, setBooks] = useState<DiplomaBook[]>([]);
  const [decisions, setDecisions] = useState<GraduationDecision[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [booksData, decisionsData, fieldsData] = await Promise.all([
        diplomaBookService.getAll(),
        graduationDecisionService.getAll(),
        formFieldService.getAll()
      ]);
      setBooks(booksData);
      setDecisions(decisionsData);
      setFormFields(fieldsData);
    };
    loadData();
  }, []);

  const renderFieldInput = (field: FormField) => {
    switch (field.dataType) {
      case 'date':
        return <DatePicker style={{ width: '100%' }} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      default:
        return <Input />;
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        birthDate: initialValues?.birthDate ? moment(initialValues.birthDate) : undefined
      }}
    >
      <Form.Item
        name="decisionId"
        label="Quyết định tốt nghiệp"
        rules={[{ required: true }]}
      >
        <Select>
          {decisions.map(decision => (
            <Select.Option key={decision.id} value={decision.id}>
              {decision.decisionNumber} - {moment(decision.issueDate).format('DD/MM/YYYY')}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="studentId"
        label="Mã sinh viên"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="birthDate"
        label="Ngày sinh"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {formFields.map(field => (
        <Form.Item
          key={field.id}
          name={['fieldValues', field.id]}
          label={field.displayName}
          rules={[{ required: field.isRequired }]}
        >
          {renderFieldInput(field)}
        </Form.Item>
      ))}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiplomaForm;