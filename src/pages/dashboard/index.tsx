import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, Typography, Divider } from 'antd';
import { TeamOutlined, FileOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { connect, ConnectProps } from 'umi';
import { ClubModelState, Club, ClubMember } from '@/models/club';

const { Title } = Typography;

interface DashboardProps extends ConnectProps {
  clubs: Club[];
  registrations: ClubMember[];
  loading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ dispatch, clubs, registrations, loading }) => {
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

  // Calculate statistics
  const totalClubs = clubs.length;
  const activeClubs = clubs.filter(club => club.active).length;
  
  const totalRegistrations = registrations.length;
  const pendingRegistrations = registrations.filter(reg => reg.status === 'pending').length;
  const approvedRegistrations = registrations.filter(reg => reg.status === 'approved').length;
  const rejectedRegistrations = registrations.filter(reg => reg.status === 'rejected').length;

  // Prepare data for column chart
  const chartData: any[] = [];
  
  clubs.forEach(club => {
    const clubRegistrations = registrations.filter(reg => reg.clubId === club.id);
    const pending = clubRegistrations.filter(reg => reg.status === 'pending').length;
    const approved = clubRegistrations.filter(reg => reg.status === 'approved').length;
    const rejected = clubRegistrations.filter(reg => reg.status === 'rejected').length;
    
    if (pending > 0) {
      chartData.push({
        club: club.name,
        status: 'Pending',
        count: pending,
      });
    }
    
    if (approved > 0) {
      chartData.push({
        club: club.name,
        status: 'Approved',
        count: approved,
      });
    }
    
    if (rejected > 0) {
      chartData.push({
        club: club.name,
        status: 'Rejected',
        count: rejected,
      });
    }
  });

  const config = {
    data: chartData,
    isGroup: true,
    xField: 'club',
    yField: 'count',
    seriesField: 'status',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    color: ['#1890ff', '#52c41a', '#ff4d4f'],
  };

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Clubs"
              value={totalClubs}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Registrations"
              value={totalRegistrations}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Approved Registrations"
              value={approvedRegistrations}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Registrations"
              value={pendingRegistrations}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Registrations by Club</Title>
        <Column {...config} />
      </Card>
    </PageContainer>
  );
};

export default connect(({ club, loading }: { club: ClubModelState; loading: { effects: Record<string, boolean> } }) => ({
  clubs: club.clubs,
  registrations: club.registrations,
  loading: loading.effects['club/fetchClubs'] || loading.effects['club/fetchRegistrations'],
}))(Dashboard);