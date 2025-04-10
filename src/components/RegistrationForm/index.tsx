import React from 'react';
import { Form, Input, Select, Button, Radio } from 'antd';
import { ClubMember, Club } from '@/models/club';

interface RegistrationFormProps {
  initialValues?: ClubMember;
  clubs: Club[];
  onFinish: (values: any) => void;
  loading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  initialValues, 
  clubs, 
  onFinish, 
  loading 
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
        label="Full Name"
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phone"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: 'Please select your gender!' }]}
      >
        <Radio.Group>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
          <Radio value="other">Other</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Please input your address!' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label="Strengths"
        name="strengths"
        rules={[{ required: true, message: 'Please input your strengths!' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label="Club"
        name="clubId"
        rules={[{ required: true, message: 'Please select a club!' }]}
      >
        <Select placeholder="Select a club">
          {clubs.map(club => (
            <Select.Option key={club.id} value={club.id}>{club.name}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Registration Reason"
        name="registrationReason"
        rules={[{ required: true, message: 'Please input your reason for registration!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues?.id ? 'Update Registration' : 'Submit Registration'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;