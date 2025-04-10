import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Table, Button, Space, Modal, Tag, Typography, message, 
  Popconfirm, Input, Form, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  CheckOutlined, CloseOutlined, HistoryOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { connect, ConnectProps } from 'umi';
import { ClubMember, Club, ClubModelState } from '@/models/club';
import RegistrationForm from '@/components/RegistrationForm';
import StatusHistoryModal from '@/components/StatusHistoryModal';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface RegistrationsPageProps extends ConnectProps {
  registrations: ClubMember[];
  clubs: Club[];
  loading: boolean;
}

const RegistrationsPage: React.FC<RegistrationsPageProps> = ({ 
  dispatch, 
  registrations, 
  clubs, 
  loading 
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [currentRegistration, setCurrentRegistration] = useState<ClubMember | undefined>(undefined);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkActionModalVisible, setBulkActionModalVisible] = useState<boolean>(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject'>('approve');
  const [bulkRejectReason, setBulkRejectReason] = useState<string>('');

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'club/fetchClubs',
      });
      dispatch({
        type: 'club/fetchRegistrations',
      });
    }
  }, [dispatch]);

  const showModal = (registration?: ClubMember) => {
    setCurrentRegistration(registration);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentRegistration(undefined);
  };

  const handleSubmit = (values: any) => {
    if (dispatch) {
      if (currentRegistration?.id) {
        dispatch({
          type: 'club/updateRegistration',
          payload: {
            ...currentRegistration,
            ...values,
          },
        });
        message.success('Registration updated successfully');
      } else {
        dispatch({
          type: 'club/addRegistration',
          payload: values,
        });
        message.success('Registration submitted successfully');
      }
      setVisible(false);
      setCurrentRegistration(undefined);
    }
  };

  const handleDelete = (id: string) => {
    if (dispatch) {
      dispatch({
        type: 'club/removeRegistration',
        payload: id,
      });
      message.success('Registration deleted successfully');
    }
  };

  const showDeleteConfirm = (registration: ClubMember) => {
    confirm({
      title: `Are you sure you want to delete this registration?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(registration.id);
      },
    });
  };

  const handleApprove = (id: string) => {
    if (dispatch) {
      dispatch({
        type: 'club/approveRegistration',
        payload: {
          id,
          adminName: 'Admin', // In a real app, this would be the current user's name
        },
      });
      message.success('Registration approved successfully');
    }
  };

  const showRejectModal = (registration: ClubMember) => {
    setCurrentRegistration(registration);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleReject = () => {
    if (dispatch && currentRegistration) {
      dispatch({
        type: 'club/rejectRegistration',
        payload: {
          id: currentRegistration.id,
          reason: rejectReason,
          adminName: 'Admin', // In a real app, this would be the current user's name
        },
      });
      message.success('Registration rejected successfully');
      setRejectModalVisible(false);
      setCurrentRegistration(undefined);
      setRejectReason('');
    }
  };

  const showHistoryModal = (registration: ClubMember) => {
    setCurrentRegistration(registration);
    setHistoryVisible(true);
  };

  const handleHistoryCancel = () => {
    setHistoryVisible(false);
    setCurrentRegistration(undefined);
  };

  const showBulkActionModal = (action: 'approve' | 'reject') => {
    setBulkAction(action);
    setBulkRejectReason('');
    setBulkActionModalVisible(true);
  };

  const handleBulkAction = () => {
    if (dispatch && selectedRowKeys.length > 0) {
      if (bulkAction === 'approve') {
        dispatch({
          type: 'club/bulkApproveRegistrations',
          payload: {
            ids: selectedRowKeys,
            adminName: 'Admin', // In a real app, this would be the current user's name
          },
        });
        message.success(`${selectedRowKeys.length} registrations approved successfully`);
      } else {
        dispatch({
          type: 'club/bulkRejectRegistrations',
          payload: {
            ids: selectedRowKeys,
            reason: bulkRejectReason,
            adminName: 'Admin', // In a real app, this would be the current user's name
          },
        });
        message.success(`${selectedRowKeys.length} registrations rejected successfully`);
      }
      setBulkActionModalVisible(false);
      setSelectedRowKeys([]);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="blue">Pending</Tag>;
      case 'approved':
        return <Tag color="green">Approved</Tag>;
      case 'rejected':
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Unknown Club';
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record: ClubMember) => ({
      disabled: record.status !== 'pending', // Only allow selection of pending registrations
    }),
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ClubMember, b: ClubMember) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
        { text: 'Other', value: 'other' },
      ],
      onFilter: (value: string, record: ClubMember) => record.gender === value,
    },
    {
      title: 'Club',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId: string) => getClubName(clubId),
      filters: clubs.map(club => ({ text: club.name, value: club.id })),
      onFilter: (value: string, record: ClubMember) => record.clubId === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value: string, record: ClubMember) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ClubMember) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            size="small"
          >
            Delete
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                size="small"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                onClick={() => showRejectModal(record)}
                size="small"
              >
                Reject
              </Button>
            </>
          )}
          <Button
            type="default"
            icon={<HistoryOutlined />}
            onClick={() => showHistoryModal(record)}
            size="small"
          >
            History
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Add New Registration
            </Button>
          </Col>
          {selectedRowKeys.length > 0 && (
            <>
              <Col>
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />} 
                  onClick={() => showBulkActionModal('approve')}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Approve {selectedRowKeys.length} Selected
                </Button>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  danger 
                  icon={<CloseOutlined />} 
                  onClick={() => showBulkActionModal('reject')}
                >
                  Reject {selectedRowKeys.length} Selected
                </Button>
              </Col>
            </>
          )}
        </Row>
      </div>
      
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={registrations}
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: record => (
            <div style={{ margin: 0 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Title level={5}>Address</Title>
                  <Text>{record.address}</Text>
                </Col>
                <Col span={12}>
                  <Title level={5}>Strengths</Title>
                  <Text>{record.strengths}</Text>
                </Col>
                <Col span={24}>
                  <Title level={5}>Registration Reason</Title>
                  <Text>{record.registrationReason}</Text>
                </Col>
                {record.status === 'rejected' && record.rejectReason && (
                  <Col span={24}>
                    <Title level={5}>Rejection Reason</Title>
                    <Text type="danger">{record.rejectReason}</Text>
                  </Col>
                )}
              </Row>
            </div>
          ),
        }}
      />
      
      <Modal
        title={currentRegistration ? 'Edit Registration' : 'Add New Registration'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <RegistrationForm
          initialValues={currentRegistration}
          clubs={clubs.filter(club => club.active)}
          onFinish={handleSubmit}
          loading={loading}
        />
      </Modal>

      <Modal
        title="Reject Registration"
        visible={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleReject}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Rejection Reason"
            required
            rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
          >
            <Input.TextArea 
              rows={4} 
              value={rejectReason} 
              onChange={e => setRejectReason(e.target.value)} 
              placeholder="Please provide a reason for rejection"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${bulkAction === 'approve' ? 'Approve' : 'Reject'} ${selectedRowKeys.length} Registrations`}
        visible={bulkActionModalVisible}
        onCancel={() => setBulkActionModalVisible(false)}
        onOk={handleBulkAction}
        okText={bulkAction === 'approve' ? 'Approve All' : 'Reject All'}
        okButtonProps={{ danger: bulkAction === 'reject' }}
      >
        {bulkAction === 'approve' ? (
          <p>Are you sure you want to approve {selectedRowKeys.length} registrations?</p>
        ) : (
          <Form layout="vertical">
            <Form.Item
              label="Rejection Reason"
              required
              rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
            >
              <Input.TextArea 
                rows={4} 
                value={bulkRejectReason} 
                onChange={e => setBulkRejectReason(e.target.value)} 
                placeholder="Please provide a reason for rejection"
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {currentRegistration && (
        <StatusHistoryModal
          visible={historyVisible}
          onCancel={handleHistoryCancel}
          member={currentRegistration}
        />
      )}
    </PageContainer>
  );
};

export default connect(({ club, loading }: { club: ClubModelState; loading: { effects: Record<string, boolean> } }) => ({
  registrations: club.registrations,
  clubs: club.clubs,
  loading: loading.effects['club/fetchRegistrations'] || 
           loading.effects['club/addRegistration'] || 
           loading.effects['club/updateRegistration'] || 
           loading.effects['club/removeRegistration'] ||
           loading.effects['club/approveRegistration'] ||
           loading.effects['club/rejectRegistration'] ||
           loading.effects['club/bulkApproveRegistrations'] ||
           loading.effects['club/bulkRejectRegistrations'],
}))(RegistrationsPage);