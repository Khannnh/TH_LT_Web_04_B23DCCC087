import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Table, Card, message } from 'antd';
import type { Diploma } from '@/types/diploma';
import { searchDiplomas } from '@/services/diploma';
import moment from 'moment';

const Search: React.FC = () => {
  const [form] = Form.useForm();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (values: any) => {
    const filledFields = Object.entries(values).filter(([_, value]) => value !== undefined && value !== '');

    if (filledFields.length < 2) {
      message.warning('Vui lòng nhập ít nhất 2 thông tin để tìm kiếm');
      return;
    }

    try {
      setLoading(true);
      const { data } = await searchDiplomas(values);
      setDiplomas(data);
    } catch (error) {
      message.error('Không thể tìm kiếm văn bằng');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'bookNumber',
      key: 'bookNumber',
    },
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
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date: Date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Quyết định',
      dataIndex: ['graduationDecision', 'decisionNumber'],
      key: 'graduationDecision',
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_: any, record: Diploma) => (
        <Button type="link" onClick={() => window.open(`/diplomas/${record.id}`, '_blank')}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="Tra cứu văn bằng" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          onFinish={handleSearch}
          layout="vertical"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <Form.Item
              name="diplomaNumber"
              label="Số hiệu văn bằng"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="bookNumber"
              label="Số vào sổ"
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="studentId"
              label="Mã sinh viên"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fullName"
              label="Họ tên"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label="Ngày sinh"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={diplomas}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default Search;
