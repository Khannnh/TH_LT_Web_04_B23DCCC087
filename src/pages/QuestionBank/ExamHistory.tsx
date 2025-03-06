import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space } from 'antd';

interface Exam {
  id: string;
  subjectId: string;
  name: string;
  date: string;
  structure: Array<{
    difficulty: string;
    knowledgeBlock: string;
    count: number;
  }>;
  questions: string[];
}

interface Subject {
  id: string;
  name: string;
}

const ExamHistory: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const storedExams = localStorage.getItem('qb_exams');
    const storedSubjects = localStorage.getItem('qb_subjects');
    if (storedExams) setExams(JSON.parse(storedExams));
    if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
  }, []);

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
  ];

  return (
    <Card title="Lịch sử đề thi">
      <Table columns={columns} dataSource={exams} rowKey="id" />
    </Card>
  );
};

export default ExamHistory;
