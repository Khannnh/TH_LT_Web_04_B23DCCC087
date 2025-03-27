import React, { useState } from 'react';
import { Table, Form, Input, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDiplomaModel } from '@/models/diploma';
import { useGraduationDecisionModel } from '@/models/graduationDecision';
import type { Diploma } from '@/models/diploma';

const DiplomaSearch: React.FC = () => {
  const { diplomas } = useDiplomaModel();
  const { decisions } = useGraduationDecisionModel();
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<Diploma[]>([]);

  const handleSearch = (values: any) => {
    const { keyword } = values;
    if (!keyword) {
      setSearchResults([]);
      return;
    }

    const results = diplomas.filter(diploma => {
      const decision = decisions.find(d => d.id === diploma.graduationDecisionId);
      return (
        diploma.diplomaNumber.toLowerCase().includes(keyword.toLowerCase()) ||
        diploma.studentId.toLowerCase().includes(keyword.toLowerCase()) ||
        diploma.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
        (decision && decision.decisionNumber.toLowerCase().includes(keyword.toLowerCase()))
      );
    });

    setSearchResults(results);
    if (results.length === 0) {
      message.info('Không tìm thấy văn bằng nào');
    }
  };

  const columns = [
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber',
      key: 'diplomaNumber',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Quyết định tốt nghiệp',
      key: 'decisionNumber',
      render: (text: string, record: Diploma) => {
        const decision = decisions.find(d => d.id === record.graduationDecisionId);
        return decision ? decision.decisionNumber : '';
      },
    },
  ];

  return (
    <div>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="keyword">
          <Input
            placeholder="Nhập từ khóa tìm kiếm (số hiệu văn bằng, mã sinh viên, họ tên, số quyết định)"
            style={{ width: 400 }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={searchResults}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DiplomaSearch;
