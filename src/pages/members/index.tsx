import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Table, Button, Space, Modal, Select, Typography, message, 
  Row, Col, Card, Statistic, Form 
} from 'antd';
import { 
  SwapOutlined, HistoryOutlined, DownloadOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { connect, ConnectProps, useLocation } from 'umi';
import { ClubMember, Club, ClubModelState } from '@/models/club';
import StatusHistoryModal from '@/components/StatusHistoryModal';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface MembersPageProps extends ConnectProps {
  members: ClubMember[];
  clubs: Club[];
  loading: boolean;
}

const MembersPage: React.FC<MembersPageProps> = ({ 
  dispatch, 
  members, 
  clubs, 
  loading 
}) => {
  const location = useLocation();
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [currentMember, setCurrentMember] = useState<ClubMember | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [changeClubModalVisible, setChangeClubModalVisible] = useState<boolean>(false);
  const [newClubId, setNewClubId] = useState<string>('');
  const [currentClubId, setCurrentClubId] = useState<string | null>(null);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'club/fetchClubs',
      });
      
      // Parse clubId from URL query parameters
      const params = new URLSearchParams(location.search);
      const clubId = params.get('clubId');
      setCurrentClubId(clubId);
      
      dispatch({
        type: 'club/fetchMembers',
        payload: { clubId },
      });
      
      if (clubId) {
        dispatch({
          type: 'club/setCurrentClub',
          payload: clubs.find(club => club.id === clubId),
        });
      }
    }
  }, [dispatch, location.search]);

  const showHistoryModal = (member: ClubMember) => {
    setCurrentMember(member);
    setHistoryVisible(true);
  };

  const handleHistoryCancel = () => {
    setHistoryVisible(false);
    setCurrentMember(undefined);
  };

  const showChangeClubModal = () => {
    setNewClubId('');
    setChangeClubModalVisible(true);
  };

  const handleChangeClub = () => {
    if (dispatch && newClubId && selectedRowKeys.length > 0) {
      dispatch({
        type: 'club/changeClubForMembers',
        payload: {
          memberIds: selectedRowKeys,
          newClubId,
          adminName: 'Admin', // In a real app, this would be the current user's name
          currentClubId,
        },
      });
      message.success(`${selectedRowKeys.length} members transferred to ${clubs.find(c => c.id === newClubId)?.name}`);
      setChangeClubModalVisible(false);
      setSelectedRowKeys([]);
    }
  };

  const exportToExcel = () => {
    // Filter members by current club if needed
    const dataToExport = currentClubId 
      ? members.filter(member => member.clubId === currentClubId)
      : members;
    
    // Prepare data for export
    const exportData = dataToExport.map(member => ({
      'Name': member.name,
      'Email': member.email,
      'Phone': member.phone,
      'Gender': member.gender,
      'Address': member.address,
      'Strengths': member.strengths,
      'Club': clubs.find(c => c.id === member.clubId)?.name || 'Unknown',
      'Registration Reason': member.registrationReason,
    }));
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    
    // Generate club name for filename
    const clubName = currentClubId 
      ? clubs.find(c => c.id === currentClubId)?.name || 'All-Clubs'
      : 'All-Clubs';
    
    // Export to file
    XLSX.writeFile(wb, `${clubName}-Members-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    message.success('Members exported to Excel successfully');
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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ClubMember) => (
        <Space size="small">
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
    <PageContainer
      title={currentClubId ? `Members of ${getClubName(currentClubId)}` : 'All Club Members'}
    >
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {selectedRowKeys.length > 0 && (
            <Col>
              <Button 
                type="primary" 
                icon={<SwapOutlined />} 
                onClick={showChangeClubModal}
              >
                Change Club for {selectedRowKeys.length} Selected
              </Button>
            </Col>
          )}
          <Col>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
          </Col>
        </Row>
      </div>
      
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={members}
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
              </Row>
            </div>
          ),
        }}
      />
      
      <Modal
        title={`Change Club for ${selectedRowKeys.length} Members`}
        visible={changeClubModalVisible}
        onCancel={() => setChangeClubModalVisible(false)}
        onOk={handleChangeClub}
        okButtonProps={{ disabled: !newClubId }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Select New Club"
            required
            rules={[{ required: true, message: 'Please select a club' }]}
          >
            <Select
              placeholder="Select a club"
              value={newClubId}
              onChange={value => setNewClubId(value)}
              style={{ width: '100%' }}
            >
              {clubs.filter(club => club.active && club.id !== currentClubId).map(club => (
                <Option key={club.id} value={club.id}>{club.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {currentMember && (
        <StatusHistoryModal
          visible={historyVisible}
          onCancel={handleHistoryCancel}
          member={currentMember}
        />
      )}
    </PageContainer>
  );
};

export default connect(({ club, loading }: { club: ClubModelState; loading: { effects: Record<string, boolean> } }) => ({
  members: club.members,
  clubs: club.clubs,
  loading: loading.effects['club/fetchMembers'] || loading.effects['club/changeClubForMembers'],
}))(MembersPage);