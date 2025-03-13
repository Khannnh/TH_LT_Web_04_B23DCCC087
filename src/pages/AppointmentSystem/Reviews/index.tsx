import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Rate, Button, Space } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import type { Review } from '@/models/review';
import { getReviews } from '@/services/review';

const ReviewsPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<Review>[] = [
    {
      title: 'Nhân viên',
      dataIndex: 'employeeId',
      width: 200,
      // Cần join với bảng Employee để lấy tên nhân viên
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceId',
      width: 200,
      // Cần join với bảng Service để lấy tên dịch vụ
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      width: 200,
      render: (dom, entity) => <Rate disabled defaultValue={entity.rating} />,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Phản hồi',
      dataIndex: 'reply',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      width: 150,
      render: (dom, entity) => moment(entity.createdAt).format('DD/MM/YYYY HH:mm'),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<Review>
          actionRef={actionRef}
          columns={columns}
          request={async (params) => {
            const response = await getReviews(params);
            return {
              data: response.data,
              success: true,
              total: response.total,
            };
          }}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>
    </PageContainer>
  );
};

export default ReviewsPage;