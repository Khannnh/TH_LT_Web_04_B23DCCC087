import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

interface Question {
  id: string;
  subjectId: string;
  content: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  knowledgeBlock: string;
}

interface Subject {
  id: string;
  name: string;
  knowledgeBlocks: string[];
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedQuestions = localStorage.getItem('qb_questions');
    const storedSubjects = localStorage.getItem('qb_subjects');
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
    if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
  }, []);

  const saveToStorage = (newQuestions: Question[]) => {
    localStorage.setItem('qb_questions', JSON.stringify(newQuestions));
    setQuestions(newQuestions);
  };

  const handleSubmit = (values: any) => {
    if (editingId) {
      const newQuestions = questions.map(question =>
        question.id === editingId ? { ...question, ...values } : question
      );
      saveToStorage(newQuestions);
      message.success('Cập nhật câu hỏi thành công');
    } else {
      const newQuestion = {
        id: Date.now().toString(),
        ...values,
      };
      saveToStorage([...questions, newQuestion]);
      message.success('Thêm câu hỏi thành công');
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
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Mức độ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: string) => {
        const colors: Record<string, string> = {
          'Dễ': 'green',
          'Trung bình': 'blue',
          'Khó': 'orange',
          'Rất khó': 'red',
        };
        return <Tag color={colors[difficulty as keyof typeof colors]}>{difficulty}</Tag>;
      },
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlock',
      key: 'knowledgeBlock',
      render: (block: string) => <Tag>{block}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Question) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue(record);
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa câu hỏi này?"
            onConfirm={() => {
              const newQuestions = questions.filter(q => q.id !== record.id);
              saveToStorage(newQuestions);
              message.success('Xóa câu hỏi thành công');
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý câu hỏi">
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
        Thêm câu hỏi
      </Button>

      <Table columns={columns} dataSource={questions} rowKey="id" />

      <Modal
        title={editingId ? "Sửa câu hỏi" : "Thêm câu hỏi"}
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
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Mức độ"
            rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
          >
            <Select>
              {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(difficulty => (
                <Select.Option key={difficulty} value={difficulty}>
                  {difficulty}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.subjectId !== currentValues.subjectId}
          >
            {({ getFieldValue }) => (
              <Form.Item
                name="knowledgeBlock"
                label="Khối kiến thức"
                rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
              >
                <Select>
                  {getFieldValue('subjectId') && subjects
                    .find(s => s.id === getFieldValue('subjectId'))
                    ?.knowledgeBlocks.map(block => (
                      <Select.Option key={block} value={block}>
                        {block}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Questions;
