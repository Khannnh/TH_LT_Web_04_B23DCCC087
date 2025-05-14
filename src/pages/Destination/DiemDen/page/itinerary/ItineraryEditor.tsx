import { Button, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import DestinationFormModal from './DestinationFormModal';
import DestinationItem from './DestinationItem';

export interface Destination {
  id: string;
  name: string;
  location: string;
  day: number;
}

export default function ItineraryEditor() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = () => {
    setEditingDestination(null);
    setModalOpen(true);
  };

  const handleSave = (destination: Destination) => {
    setDestinations((prev) => {
      const exists = prev.find((d) => d.id === destination.id);
      if (exists) {
        return prev.map((d) => (d.id === destination.id ? destination : d));
      }
      return [...prev, destination];
    });
    setModalOpen(false);
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lịch trình du lịch</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Thêm điểm đến
      </Button>
      <List
        className="mt-4"
        dataSource={destinations}
        renderItem={(item) => (
          <DestinationItem
            key={item.id}
            destination={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      />
      <DestinationFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingDestination}
      />
    </div>
  );
}
