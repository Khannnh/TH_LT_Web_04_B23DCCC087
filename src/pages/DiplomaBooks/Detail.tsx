import React, { useState, useEffect } from 'react';
import { useParams, history } from 'umi';
import { Table, Button, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { DiplomaBook, Diploma } from '@/types/diploma';
import { getDiplomaBookDetail, getDiplomas } from '@/services/diploma';

const DiplomaBookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<DiplomaBook>();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookResponse, diplomasResponse] = await Promise.all([
        getDiplomaBookDetail(id),
        getDiplomas({ graduationDecisionId: id }),
      ]);
      setBook(bookResponse.data);
      setDiplomas(diplomasResponse.data);
    } catch (error) {
      message.error('Không thể tải thông tin sổ văn bằng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
      render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Diploma) => (
        <Button type="link" onClick={() => history.push(`/diplomas/${record.id}`)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title={`Sổ văn bằng năm ${book?.year}`} style={{ marginBottom: 16 }}>
        <p>Tổng số văn bằng: {book?.totalDiplomas}</p>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push(`/diplomas/create?bookId=${id}`)}
        >
          Thêm văn bằng mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={diplomas}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default DiplomaBookDetail;
