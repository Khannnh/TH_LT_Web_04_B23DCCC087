import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { GraduationDecision } from '@/models/diploma';
import { graduationDecisionService } from '@/services/diploma';

const DecisionsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>();

  const handleEdit = (record: GraduationDecision) => {
    // TODO: Implement edit functionality
    console.log('Edit record:', record);
  };

  const handleView = (record: GraduationDecision) => {
    // TODO: Implement view functionality
    console.log('View record:', record);
  };

  const columns: ProColumns<GraduationDecision>[] = [
    {
      title: 'Số quyết định',
      dataIndex: 'decisionNumber',
      search: true,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: 'Trích yếu',
      dataIndex: 'summary',
      ellipsis: true,
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'searchCount',
      sorter: true,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_: any, record: GraduationDecision) => [
        <Button key="edit" type="link" onClick={() => handleEdit(record)}>
          Chỉnh sửa
        </Button>,
        <Button key="view" type="link" onClick={() => handleView(record)}>
          Chi tiết
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable<GraduationDecision>
          actionRef={actionRef}
          columns={columns}
          request={async (params) => {
            const data = await graduationDecisionService.getAll();
            return {
              data,
              success: true,
              total: data.length,
            };
          }}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              onClick={() => setModalVisible(true)}
              icon={<PlusOutlined />}
            >
              Thêm quyết định
            </Button>,
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default DecisionsPage;