import { useState, useCallback } from 'react';
import { message } from 'antd';
import { Room, Staff } from './room';
import { roomService } from '@/services/classroom/room';

export default function useRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = roomService.getAll();
      setRooms(data);
      setStaffs(roomService.getStaffs());
    } catch (error) {
      message.error('Không thể tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(async (values: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newRoom = await roomService.create(values);
      setRooms(prev => [...prev, newRoom]);
      message.success('Thêm phòng thành công');
      return newRoom;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Thêm phòng thất bại';
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (id: string, values: Partial<Room>) => {
    setLoading(true);
    try {
      const updatedRoom = await roomService.update(id, values);
      setRooms(prev => prev.map(room => room.id === id ? updatedRoom : room));
      message.success('Cập nhật phòng thành công');
      return updatedRoom;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Cập nhật phòng thất bại';
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(false); 
    }
  }, []);

  const deleteRoom = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await roomService.delete(id);
      setRooms(prev => prev.filter(room => room.id !== id));
      message.success('Xóa phòng thành công');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Xóa phòng thất bại';
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rooms,
    staffs, 
    loading,
    loadRooms,
    createRoom,
    updateRoom,
    deleteRoom
  };
}