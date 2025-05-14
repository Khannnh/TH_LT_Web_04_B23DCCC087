import { List, Space, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Destination } from './ItineraryEditor';

interface Props {
  destination: Destination;
  onEdit: (destination: Destination) => void;
  onDelete: (id: string) => void;
}

export default function DestinationItem({ destination, onEdit, onDelete }: Props) {
  return (
    <List.Item
      actions={[
        <Button icon={<EditOutlined />} onClick={() => onEdit(destination)} />,
        <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(destination.id)} />,
      ]}
    >
      <List.Item.Meta
        title={destination.name}
        description={`Địa điểm: ${destination.location}, Ngày: ${destination.day}`}
      />
    </List.Item>
  );
}
