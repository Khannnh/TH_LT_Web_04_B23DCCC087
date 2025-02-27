import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Subject {
  id: string;
  name: string;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  const saveToStorage = (newSubjects: Subject[]) => {
    localStorage.setItem('subjects', JSON.stringify(newSubjects));
    setSubjects(newSubjects);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: Subject) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    const newSubjects = subjects.filter(subject => subject.id !== id);
    saveToStorage(newSubjects);
    message.success('Xóa môn học thành công');
  };

  const handleSubmit = (values: any) => {
    if (editingId) {
      const newSubjects = subjects.map(subject =>
        subject.id === editingId ? { ...subject, ...values } : subject
      );
      saveToStorage(newSubjects);
      message.success('Cập nhật môn học thành công');
    } else {
      const newSubject = {
        id: Date.now().toString(),
        ...values,
      };
      saveToStorage([...subjects, newSubject]);
      message.success('Thêm môn học thành công');
    }
    setVisible(false);
  };

  const columns = [
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: Subject) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa môn học này?"
            onConfirm={() => handleDelete(record.id)}
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
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
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
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Subjects;