import React from 'react';
import { Card, Row, Col, Spin, Table, Typography } from 'antd';
import { ThongKeData, DiaDiemPhoBien } from '@/models/thongkeModel';

interface Props {
  dataTheoThang: ThongKeData[];
  diaDiemPhoBien: DiaDiemPhoBien[];
  loading?: boolean;
}

const BieuDoThongKe: React.FC<Props> = ({ dataTheoThang, diaDiemPhoBien, loading }) => {
  if (loading) {
    return <Spin size="large" />;
  }

  const tongSoLuotTao = dataTheoThang.reduce((sum, item) => sum + item.soLuotTao, 0);

  const thangColumns = [
    {
      title: 'Tháng/Năm',
      dataIndex: 'thangNam',
      key: 'thangNam',
    },
    {
      title: 'Lần',
      dataIndex: 'soLuotTao',
      key: 'soLuotTao',
    },
  ];

  const diaDiemColumns = [
    {
      title: 'Tên địa điểm',
      dataIndex: 'tenDiaDiem',
      key: 'tenDiaDiem',
    },
    {
      title: 'Số lần xuất hiện',
      dataIndex: 'soLanXuatHien',
      key: 'soLanXuatHien',
    },
  ];

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Tổng số lượt tạo địa điểm: {tongSoLuotTao}
      </Typography.Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Số lượt tạo lịch trình theo tháng">
            <Table
              dataSource={dataTheoThang}
              columns={thangColumns}
              pagination={false}
              rowKey="thangNam"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Địa điểm phổ biến">
            <Table
              dataSource={diaDiemPhoBien}
              columns={diaDiemColumns}
              pagination={false}
              rowKey="tenDiaDiem"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BieuDoThongKe;
