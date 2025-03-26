import React, { useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { Classroom } from './classroom';
import { classroomService } from '@/services/PhongHoc/classroomService';

export interface ClassroomListModel {
  classrooms: Classroom[];
  loading: boolean;
  searchText: string;
  filterType: Classroom['type'] | null;
  sortOrder: 'ascend' | 'descend' | null;
  modalVisible: boolean;
  deleteModalVisible: boolean;
  editingClassroom: Classroom | undefined;
  selectedClassroom: Classroom | null;

  // Actions
  setSearchText: (text: string) => void;
  setFilterType: (type: Classroom['type'] | null) => void;
  setSortOrder: (order: 'ascend' | 'descend' | null) => void;
  setModalVisible: (visible: boolean) => void;
  setDeleteModalVisible: (visible: boolean) => void;
  setEditingClassroom: (classroom: Classroom | undefined) => void;
  setSelectedClassroom: (classroom: Classroom | null) => void;

  // CRUD operations
  fetchClassrooms: () => Promise<void>;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => Promise<void>;
  updateClassroom: (id: string, classroom: Omit<Classroom, 'id'>) => Promise<void>;
  deleteClassroom: (id: string) => Promise<void>;
}

export const useClassroomListModel = (): ClassroomListModel => {
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<Classroom['type'] | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | undefined>();
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const data = await classroomService.getAll();
      setAllClassrooms(data);
    } catch (error) {
      message.error('Không thể tải danh sách phòng học');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchClassrooms();
  }, []);

  // Xử lý tìm kiếm, lọc và sắp xếp
  const classrooms = useMemo(() => {
    let result = [...allClassrooms];

    // Tìm kiếm theo mã phòng hoặc tên phòng
    if (searchText) {
      const searchLower = searchText.toLowerCase().trim();
      result = result.filter(
        classroom =>
          classroom.roomCode.toLowerCase().includes(searchLower) ||
          classroom.name.toLowerCase().includes(searchLower)
      );
    }

    // Lọc theo loại phòng
    if (filterType) {
      result = result.filter(classroom => classroom.type === filterType);
    }

    // Sắp xếp theo số chỗ ngồi
    if (sortOrder) {
      result.sort((a, b) => {
        if (sortOrder === 'ascend') {
          return a.capacity - b.capacity;
        } else {
          return b.capacity - a.capacity;
        }
      });
    }

    return result;
  }, [allClassrooms, searchText, filterType, sortOrder]);

  const addClassroom = async (classroom: Omit<Classroom, 'id'>) => {
    try {
      setLoading(true);
      await classroomService.add(classroom);
      await fetchClassrooms();
      message.success('Thêm phòng học thành công');
      setModalVisible(false);
    } catch (error) {
      message.error('Không thể thêm phòng học');
    } finally {
      setLoading(false);
    }
  };

  const updateClassroom = async (id: string, classroom: Omit<Classroom, 'id'>) => {
    try {
      setLoading(true);
      await classroomService.update(id, classroom);
      await fetchClassrooms();
      message.success('Cập nhật phòng học thành công');
      setModalVisible(false);
      setEditingClassroom(undefined);
    } catch (error) {
      message.error('Không thể cập nhật phòng học');
    } finally {
      setLoading(false);
    }
  };

  const deleteClassroom = async (id: string) => {
    try {
      setLoading(true);
      await classroomService.delete(id);
      await fetchClassrooms();
      message.success('Xóa phòng học thành công');
      setDeleteModalVisible(false);
      setSelectedClassroom(null);
    } catch (error) {
      message.error('Không thể xóa phòng học');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
