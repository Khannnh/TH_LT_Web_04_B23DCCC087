import React, { useState } from 'react';
import { Form, Input, DatePicker, Switch, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Club } from '@/models/club';
import TinyEditor from '../TinyEditor';

interface ClubFormProps {
  initialValues?: Club;
  onFinish: (values: any) => void;
  loading?: boolean;
}

const ClubForm: React.FC<ClubFormProps> = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState<string>(initialValues?.description || '');

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleFinish = (values: any) => {
    const formData = {
      ...values,
      description,
      foundationDate: values.foundationDate.format('YYYY-MM-DD'),
    };
    
    if (fileList.length > 0 && fileList[0].thumbUrl) {
      formData.avatar = fileList[0].thumbUrl;
    }
    
    if (initialValues?.id) {
      formData.id = initialValues.id;
    }
    
    onFinish(formData);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        foundationDate: initialValues?.foundationDate ? moment(initialValues.foundationDate) : undefined,
        active: initialValues?.active !== undefined ? initialValues.active : true,
      }}
    >
      <Form.Item
        label="Club Avatar"
        name="avatar"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={true}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          maxCount={1}
          fileList={fileList}
          customRequest={({ onSuccess }) => {
            setTimeout(() => {
              onSuccess?.("ok", undefined);
            }, 0);
          }}
        >
          {fileList.length < 1 && <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>}
        </Upload>
      </Form.Item>

      <Form.Item
        label="Club Name"
        name="name"
        rules={[{ required: true, message: 'Please input the club name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Foundation Date"
        name="foundationDate"
        rules={[{ required: true, message: 'Please select the foundation date!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Club President"
        name="president"
        rules={[{ required: true, message: 'Please input the club president!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" required>
        <TinyEditor
          value={description}
          onChange={setDescription}
        />
      </Form.Item>

      <Form.Item
        label="Active"
        name="active"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues?.id ? 'Update Club' : 'Create Club'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClubForm;