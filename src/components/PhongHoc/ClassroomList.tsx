import React, { useEffect } from 'react';
import {Table,Button,Input,Select,Space,Modal,Card,Row,Col,message,} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { Classroom } from '@/models/phonghoc/classroom';
import { useClassroomListModel } from '@/models/phonghoc/classroomList';
import ClassroomForm from './ClassroomForm';

const { Option } = Select;

const ClassroomList: React.FC = () => {
  const {
    classrooms,
    loading,
    searchText,
    filterType,
    sortOrder,
    modalVisible,
    deleteModalVisible,
    editingClassroom,
    selectedClassroom,
    setSearchText,
    setFilterType,
    setSortOrder,
    setModalVisible,
    setDeleteModalVisible,
    setEditingClassroom,
    setSelectedClassroom,
    fetchClassrooms,
    addClassroom,
    updateClassroom,
    deleteClassroom,
  } = useClassroomListModel();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilter = (value: Classroom['type'] | null) => {
    setFilterType(value);
  };

  const handleSort = (value: 'ascend' | 'descend' | null) => {
    setSortOrder(value);
  };

  const handleAdd = () => {
    setEditingClassroom(undefined);
    setModalVisible(true);
  };

  const handleEdit = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setModalVisible(true);
  };

  const handleDeleteClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (selectedClassroom) {
      await deleteClassroom(selectedClassroom.id);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingClassroom(undefined);
  };

  const handleModalOk = async (values: Omit<Classroom, 'id'>) => {
    try {
      if (editingClassroom) {
        await updateClassroom(editingClassroom.id, values);
        message.success('Cập nhật phòng học thành công');
      } else {
        await addClassroom(values);
        message.success('Thêm phòng học thành công');
      }
      setModalVisible(false);
      setEditingClassroom(undefined);
      fetchClassrooms();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'roomCode',
      key: 'roomCode',
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: true,
      render: (capacity: number) => capacity.toLocaleString(),
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Classroom) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input
              placeholder="Tìm kiếm theo mã phòng hoặc tên phòng"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo loại phòng"
              allowClear
              value={filterType}
              onChange={handleFilter}
            >
              <Option value="Lý thuyết">Lý thuyết</Option>
              <Option value="Thực hành">Thực hành</Option>
              <Option value="Hội trường">Hội trường</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Sắp xếp theo số chỗ ngồi"
              allowClear
              value={sortOrder}
              onChange={handleSort}
              suffixIcon={sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            >
              <Option value="ascend">
                <Space>
                  <SortAscendingOutlined />
                  Tăng dần
                </Space>
              </Option>
              <Option value="descend">
                <Space>
                  <SortDescendingOutlined />
                  Giảm dần
                </Space>
              </Option>
            </Select>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ width: '100%' }}
            >
              Thêm phòng học
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={classrooms}
          rowKey="id"
          loading={loading}
          style={{ marginTop: 16 }}
        />
      </Card>

      <Modal
        title={editingClassroom ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
      >
        <ClassroomForm
          initialValues={editingClassroom}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
          loading={loading}
        />
      </Modal>

      <Modal
        title="Xác nhận xóa"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>
          Bạn có chắc chắn muốn xóa phòng học{' '}
          <strong>{selectedClassroom?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default ClassroomList;
