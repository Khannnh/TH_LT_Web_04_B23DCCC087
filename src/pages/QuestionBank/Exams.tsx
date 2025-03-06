import React, { useState, useEffect } from 'react';
import { Card, Form, Select, InputNumber, Button, Table, Modal, Tag, message, Space, Divider, Input } from 'antd';
import { PlusOutlined, FileTextOutlined, SaveOutlined } from '@ant-design/icons';

interface ExamStructure {
  difficulty: string;
  knowledgeBlock: string;
  count: number;
}

interface Exam {
  id: string;
  subjectId: string;
  name: string;
  date: string;
  structure: ExamStructure[];
  questions: string[];
}

interface Question {
  id: string;
  subjectId: string;
  content: string;
  difficulty: string;
  knowledgeBlock: string;
}

interface Subject {
  id: string;
  name: string;
  knowledgeBlocks: string[];
}

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [visible, setVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedExams = localStorage.getItem('qb_exams');
    const storedSubjects = localStorage.getItem('qb_subjects');
    const storedQuestions = localStorage.getItem('qb_questions');
    if (storedExams) setExams(JSON.parse(storedExams));
    if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
  }, []);

  const saveToStorage = (newExams: Exam[]) => {
    localStorage.setItem('qb_exams', JSON.stringify(newExams));
    setExams(newExams);
  };

  const generateExam = (values: any) => {
    const { subjectId, name, structure } = values;
    const subjectQuestions = questions.filter(q => q.subjectId === subjectId);
    const selectedQuestions: string[] = [];

    structure.forEach((item: ExamStructure) => {
      const availableQuestions = subjectQuestions.filter(
        q => 
          q.difficulty === item.difficulty &&
          q.knowledgeBlock === item.knowledgeBlock &&
          !selectedQuestions.includes(q.id)
      );

      if (availableQuestions.length < item.count) {
        message.error(`Không đủ câu hỏi ${item.difficulty} cho khối kiến thức ${item.knowledgeBlock}`);
        return;
      }

      // Chọn ngẫu nhiên câu hỏi
      const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, item.count).map(q => q.id));
    });

    const newExam: Exam = {
      id: Date.now().toString(),
      subjectId,
      name,
      date: new Date().toISOString(),
      structure,
      questions: selectedQuestions,
    };

    saveToStorage([...exams, newExam]);
    message.success('Tạo đề thi thành công');
    setVisible(false);
  };

  const handleTemplateSelect = (examId: string) => {
    const selectedExam = exams.find(e => e.id === examId);
    if (selectedExam) {
      form.setFieldsValue({
        structure: selectedExam.structure
      });
    }
  };

  const columns = [
    {
      title: 'Tên đề thi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: string) => 
        subjects.find(s => s.id === subjectId)?.name || 'Không xác định',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'questions',
      key: 'questionCount',
      render: (questions: string[]) => questions.length,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Exam) => (
        <Space>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => {
              setCurrentExam(record);
              setPreviewVisible(true);
            }}
          >
            Xem đề
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý đề thi">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          form.resetFields();
          setVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Tạo đề thi mới
      </Button>

      <Table columns={columns} dataSource={exams} rowKey="id" />

      <Modal
        title="Tạo đề thi mới"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} onFinish={generateExam}>
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
            name="name"
            label="Tên đề thi"
            rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="templateExam"
            label="Cấu trúc đề sẵn"
          >
            <Select
              allowClear
              placeholder="Chọn đề thi mẫu"
              onChange={handleTemplateSelect}
            >
              {exams.map(exam => (
                <Select.Option key={exam.id} value={exam.id}>
                  {exam.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.List name="structure">
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} align="baseline">
                    <Form.Item
                      {...field}
                      label="Mức độ"
                      name={[field.name, 'difficulty']}
                      rules={[{ required: true, message: 'Chọn mức độ' }]}
                    >
                      <Select style={{ width: 120 }}>
                        {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => (
                          <Select.Option key={d} value={d}>{d}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Khối kiến thức"
                      name={[field.name, 'knowledgeBlock']}
                      rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
                    >
                      <Select style={{ width: 200 }}>
                        {subjects
                          .find(s => s.id === form.getFieldValue('subjectId'))
                          ?.knowledgeBlocks.map(block => (
                            <Select.Option key={block} value={block}>
                              {block}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Số lượng"
                      name={[field.name, 'count']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>

                    <Button onClick={() => remove(field.name)} type="link" danger>
                      Xóa
                    </Button>
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm cấu trúc
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      <Modal
        title="Xem đề thi"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {currentExam && (
          <>
            <h2>{currentExam.name}</h2>
            <p>Môn học: {subjects.find(s => s.id === currentExam.subjectId)?.name}</p>
            <Divider />
            {currentExam.questions.map((questionId, index) => {
              const question = questions.find(q => q.id === questionId);
              return (
                <div key={questionId} style={{ marginBottom: 16 }}>
                  <p>
                    <strong>Câu {index + 1}: </strong>
                    {question?.content}
                  </p>
                  <Space>
                    <Tag color="blue">{question?.difficulty}</Tag>
                    <Tag>{question?.knowledgeBlock}</Tag>
                  </Space>
                </div>
              );
            })}
          </>
        )}
      </Modal>
    </Card>
  );
};

export default Exams;
