import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Progress {
  id: string;
  subjectId: string;
  date: string;
  duration: number;
  content: string;
  note: string;
}

interface Subject {
  id: string;
  name: string;
}

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedProgress = localStorage.getItem('progress');
    const storedSubjects = localStorage.getItem('subjects');
    if (storedProgress) setProgress(JSON.parse(storedProgress));
    if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
  }, []);

  const saveToStorage = (newProgress: Progress[]) => {
    localStorage.setItem('progress', JSON.stringify(newProgress));
    setProgress(newProgress);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: Progress) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    const newProgress = progress.filter(p => p.id !== id);
    saveToStorage(newProgress);
    message.success('Xóa tiến độ thành công');
  };

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };

    if (editingId) {
      const newProgress = progress.map(p =>
        p.id === editingId ? { ...p, ...formattedValues } : p
      );
      saveToStorage(newProgress);
      message.success('Cập nhật tiến độ thành công');
    } else {
      const newProgress = {
        id: Date.now().toString(),
        ...formattedValues,
      };
      saveToStorage([...progress, newProgress]);
      message.success('Thêm tiến độ thành công');
    }
    setVisible(false);
  };

  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: string) => 
        subjects.find(s => s.id === subjectId)?.name || 'Không xác định',
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: Progress) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa tiến độ này?"
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
    <Card title="Quản lý tiến độ học tập">
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm tiến độ
      </Button>
      <Table columns={columns} dataSource={progress} rowKey="id" />
      
      <Modal
        title={editingId ? "Sửa tiến độ" : "Thêm tiến độ"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select>
              {subjects.map(subject => (
                <Select.Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày học"
            rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời lượng (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Progress;
