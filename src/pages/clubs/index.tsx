import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, Space, Modal, Tag, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect, ConnectProps, history } from 'umi';
import { Club, ClubModelState } from '@/models/club';
import ClubForm from '@/components/ClubForm';

const { Title, Paragraph } = Typography;
const { confirm } = Modal;

interface ClubsPageProps extends ConnectProps {
  clubs: Club[];
  loading: boolean;
}

const ClubsPage: React.FC<ClubsPageProps> = ({ dispatch, clubs, loading }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [currentClub, setCurrentClub] = useState<Club | undefined>(undefined);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'club/fetchClubs',
      });
    }
  }, [dispatch]);

  const showModal = (club?: Club) => {
    setCurrentClub(club);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentClub(undefined);
  };

  const handleSubmit = (values: any) => {
    if (dispatch) {
      if (currentClub?.id) {
        dispatch({
          type: 'club/updateClub',
          payload: values,
        });
        message.success('Club updated successfully');
      } else {
        dispatch({
          type: 'club/addClub',
          payload: values,
        });
        message.success('Club created successfully');
      }
      setVisible(false);
      setCurrentClub(undefined);
    }
  };

  const handleDelete = (id: string) => {
    if (dispatch) {
      dispatch({
        type: 'club/removeClub',
        payload: id,
      });
      message.success('Club deleted successfully');
    }
  };

  const showDeleteConfirm = (club: Club) => {
    confirm({
      title: `Are you sure you want to delete ${club.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(club.id);
      },
    });
  };

  const viewMembers = (clubId: string) => {
    history.push(`/members?clubId=${clubId}`);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => (
        avatar ? <img src={avatar} alt="Club Avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} /> : 
        <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No Image</div>
      ),
    },
    {
      title: 'Club Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
    },
    {
      title: 'Foundation Date',
      dataIndex: 'foundationDate',
      key: 'foundationDate',
      sorter: (a: Club, b: Club) => new Date(a.foundationDate).getTime() - new Date(b.foundationDate).getTime(),
    },
    {
      title: 'President',
      dataIndex: 'president',
      key: 'president',
      sorter: (a: Club, b: Club) => a.president.localeCompare(b.president),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: boolean, record: Club) => record.active === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Club) => (
        <Space size="middle">
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
          <Button
            type="default"
            icon={<TeamOutlined />}
            onClick={() => viewMembers(record.id)}
            size="small"
          >
            Members
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add New Club
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={clubs}
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: record => (
            <div style={{ margin: 0 }}>
              <Title level={5}>Description</Title>
              <div dangerouslySetInnerHTML={{ __html: record.description }} />
            </div>
          ),
        }}
      />
      
      <Modal
        title={currentClub ? 'Edit Club' : 'Add New Club'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <ClubForm
          initialValues={currentClub}
          onFinish={handleSubmit}
          loading={loading}
        />
      </Modal>
    </PageContainer>
  );
};

export default connect(({ club, loading }: { club: ClubModelState; loading: { effects: Record<string, boolean> } }) => ({
  clubs: club.clubs,
  loading: loading.effects['club/fetchClubs'] || loading.effects['club/addClub'] || loading.effects['club/updateClub'] || loading.effects['club/removeClub'],
}))(ClubsPage);