// src/pages/RoomManagement/index.tsx
import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Modal, Space, Popconfirm, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Room } from '@/types/classroom/room';
import useRoom from '@/models/classroom/useRoom';
import RoomForm from '@/components/RoomForm';
import { ROOM_VALIDATION } from '@/constants/classroom/room';

const RoomManagementPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [searchParams, setSearchParams] = useState<{ code?: string; name?: string }>({});
  const { rooms, staffs, loading, loadRooms, createRoom, updateRoom, deleteRoom } = useRoom();

  useEffect(() => {
    loadRooms();
  }, []);

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'capacity',
      width: 120,
      search: false,
      sorter: (a: Room, b: Room) => a.capacity - b.capacity,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      width: 120,
      search: false,
      valueEnum: {
        'Lý thuyết': { text: 'Lý thuyết' },
        'Thực hành': { text: 'Thực hành' },
        'Hội trường': { text: 'Hội trường' },
      },
      filters: true,
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'managerId',
      width: 150,
      search: false,
      render: (_: unknown, record: Room) => staffs.find(s => s.id === record.managerId)?.name,
      filters: staffs.map(staff => ({
        text: staff.name,
        value: staff.id,
      })),
    },
    {
      title: 'Thao tác',
      width: 180,
      search: false,
      render: (_: unknown, record: Room) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedRoom(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          {record.capacity < ROOM_VALIDATION.DELETE_CAPACITY_LIMIT && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa phòng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      await deleteRoom(id);
      actionRef.current?.reload();
    } catch (error) {
      // Error handled in model
    }
  };

  const handleSearch = (values: { code?: string; name?: string }) => {
    setSearchParams(values);
  };

  const getFilteredRooms = () => {
    return rooms.filter(room => {
      const codeMatch = searchParams.code
        ? room.code.toLowerCase().includes(searchParams.code.toLowerCase())
        : true;
      const nameMatch = searchParams.name
        ? room.name.toLowerCase().includes(searchParams.name.toLowerCase())
        : true;
      return codeMatch && nameMatch;
    });
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Form layout="inline" onFinish={handleSearch}>
            <Form.Item name="code" label="Mã phòng">
              <Input placeholder="Nhập mã phòng" />
            </Form.Item>
            <Form.Item name="name" label="Tên phòng">
              <Input placeholder="Nhập tên phòng" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        </div>

        <ProTable<Room>
          actionRef={actionRef}
          columns={columns}
          dataSource={getFilteredRooms()}
          rowKey="id"
          search={false}
          loading={loading}
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                setSelectedRoom(undefined);
                setModalVisible(true);
              }}
              icon={<PlusOutlined />}
            >
              Thêm phòng
            </Button>,
          ]}
        />

        <Modal
          title={selectedRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setSelectedRoom(undefined);
          }}
          footer={null}
          width={600}
        >
          <RoomForm
            initialValues={selectedRoom}
            staffs={staffs}
            onFinish={async (values) => {
              try {
                if (selectedRoom) {
                  await updateRoom(selectedRoom.id, values);
                } else {
                  await createRoom(values);
                }
                setModalVisible(false);
                actionRef.current?.reload();
              } catch (error) {
                // Error handled in model
              }
            }}
            loading={loading}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default RoomManagementPage;