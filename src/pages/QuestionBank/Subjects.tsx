import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  knowledgeBlocks: string[];
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedSubjects = localStorage.getItem('qb_subjects');
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  const saveToStorage = (newSubjects: Subject[]) => {
    localStorage.setItem('qb_subjects', JSON.stringify(newSubjects));
    setSubjects(newSubjects);
  };

  const handleSubmit = (values: any) => {
    const knowledgeBlocks = values.knowledgeBlocks.split(',').map((block: string) => block.trim());
    
    if (editingId) {
      const newSubjects = subjects.map(subject =>
        subject.id === editingId ? { ...subject, ...values, knowledgeBlocks } : subject
      );
      saveToStorage(newSubjects);
      message.success('Cập nhật môn học thành công');
    } else {
      const newSubject = {
        id: Date.now().toString(),
        ...values,
        knowledgeBlocks,
      };
      saveToStorage([...subjects, newSubject]);
      message.success('Thêm môn học thành công');
    }
    setVisible(false);
  };

  const columns = [
    {
      title: 'Mã môn',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên môn',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'credits',
      key: 'credits',
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlocks',
      key: 'knowledgeBlocks',
      render: (blocks: string[]) => (
        <>
          {blocks.map(block => (
            <Tag key={block} color="blue">{block}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Subject) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue({
                ...record,
                knowledgeBlocks: record.knowledgeBlocks.join(', '),
              });
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa môn học này?"
            onConfirm={() => {
              const newSubjects = subjects.filter(subject => subject.id !== record.id);
              saveToStorage(newSubjects);
              message.success('Xóa môn học thành công');
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card title="Quản lý môn học">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingId(null);
          form.resetFields();
          setVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm môn học
      </Button>

      <Table columns={columns} dataSource={subjects} rowKey="id" />

      <Modal
        title={editingId ? "Sửa môn học" : "Thêm môn học"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Mã môn"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên môn"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="credits"
            label="Số tín chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="knowledgeBlocks"
            label="Khối kiến thức"
            rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức' }]}
            help="Nhập các khối kiến thức, phân cách bằng dấu phẩy"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Subjects;
