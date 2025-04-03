import { Room, Staff } from '@/types/classroom/room';
import { ROOM_VALIDATION } from '@/constants/classroom/room';

export const validateRoom = (room: Partial<Room>, rooms: Room[], currentId?: string): string[] => {
  const errors: string[] = [];

  const existingRooms = currentId 
    ? rooms.filter(r => r.id !== currentId)
    : rooms;

  if (room.code && existingRooms.some(r => r.code === room.code)) {
    errors.push('Mã phòng đã tồn tại');
  }

  if (room.name && existingRooms.some(r => r.name === room.name)) {
    errors.push('Tên phòng đã tồn tại');
  }

  if (room.capacity) {
    if (room.capacity < ROOM_VALIDATION.MIN_CAPACITY) {
      errors.push(`Số chỗ ngồi tối thiểu là ${ROOM_VALIDATION.MIN_CAPACITY}`);
    }
    if (room.capacity > ROOM_VALIDATION.MAX_CAPACITY) {
      errors.push(`Số chỗ ngồi tối đa là ${ROOM_VALIDATION.MAX_CAPACITY}`);
    }
  }

  return errors;
};

export const getManagerName = (managerId: string, staffs: Staff[]): string => {
  return staffs.find(s => s.id === managerId)?.name || '';
};