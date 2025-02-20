import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Select, InputNumber, Progress as AntProgress, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Goal {
  id: string;
  subjectId: string;
  month: string;
  targetDuration: number;
}

interface Subject {
  id: string;
  name: string;
}

interface Progress {
  subjectId: string;
  date: string;
  duration: number;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedGoals = localStorage.getItem('goals');
    const storedSubjects = localStorage.getItem('subjects');
    const storedProgress = localStorage.getItem('progress');
    if (storedGoals) setGoals(JSON.parse(storedGoals));
    if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
    if (storedProgress) setProgress(JSON.parse(storedProgress));
  }, []);

  const saveToStorage = (newGoals: Goal[]) => {
    localStorage.setItem('goals', JSON.stringify(newGoals));
    setGoals(newGoals);
  };

  const calculateProgress = (goal: Goal) => {
    const monthProgress = progress.filter(p => {
      const progressMonth = moment(p.date).format('YYYY-MM');
      return p.subjectId === goal.subjectId && progressMonth === goal.month;
    });
    
    const totalDuration = monthProgress.reduce((sum, p) => sum + p.duration, 0);
    return Math.min(100, Math.round((totalDuration / goal.targetDuration) * 100));
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: Goal) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    const newGoals = goals.filter(goal => goal.id !== id);
    saveToStorage(newGoals);
    message.success('Xóa mục tiêu thành công');
  };

  const handleSubmit = (values: any) => {
    if (editingId) {
      const newGoals = goals.map(goal =>
        goal.id === editingId ? { ...goal, ...values } : goal
      );
      saveToStorage(newGoals);
      message.success('Cập nhật mục tiêu thành công');
    } else {
      const newGoal = {
        id: Date.now().toString(),
        ...values,
      };
      saveToStorage([...goals, newGoal]);
      message.success('Thêm mục tiêu thành công');
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
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Mục tiêu (phút)',
      dataIndex: 'targetDuration',
      key: 'targetDuration',
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (text: any, record: Goal) => (
        <AntProgress percent={calculateProgress(record)} />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: any, record: Goal) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa mục tiêu này?"
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
    <Card title="Quản lý mục tiêu học tập">
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm mục tiêu
      </Button>
      <Table columns={columns} dataSource={goals} rowKey="id" />
      
      <Modal
        title={editingId ? "Sửa mục tiêu" : "Thêm mục tiêu"}
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
            name="month"
            label="Tháng"
            rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}
          >
            <Select>
              {Array.from({ length: 12 }, (_, i) => moment().month(i)).map(month => (
                <Select.Option key={month.format('YYYY-MM')} value={month.format('YYYY-MM')}>
                  {month.format('MM/YYYY')}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="targetDuration"
            label="Mục tiêu (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Goals;
