import React from 'react';
import { Modal, Timeline, Tag, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ClubMember } from '@/models/club';

const { Text } = Typography;

interface StatusHistoryModalProps {
  visible: boolean;
  onCancel: () => void;
  member: ClubMember;
}

const StatusHistoryModal: React.FC<StatusHistoryModalProps> = ({ 
  visible, 
  onCancel, 
  member 
}) => {
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

  return (
    <Modal
      title={`Status History - ${member?.name}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {member?.statusHistory && member.statusHistory.length > 0 ? (
        <Timeline mode="left">
          {member.statusHistory.map((history, index) => (
            <Timeline.Item 
              key={index} 
              dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
              label={moment(history.timestamp).format('DD/MM/YYYY HH:mm:ss')}
            >
              <div>
                Status changed to {getStatusTag(history.status)}
              </div>
              <div>
                <Text type="secondary">By: {history.adminName}</Text>
              </div>
              {history.reason && (
                <div>
                  <Text>Reason: {history.reason}</Text>
                </div>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <div>No history available</div>
      )}
    </Modal>
  );
};

export default StatusHistoryModal;