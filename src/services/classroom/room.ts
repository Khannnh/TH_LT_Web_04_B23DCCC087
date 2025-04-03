import { Room, Staff } from '@/models/classroom/room';

const STORAGE_KEY = 'rooms_data';

export const roomService = {
  getAll: (): Room[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  create: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Room => {
    const rooms = roomService.getAll();
    
    // Kiểm tra trùng
    if (rooms.some(r => r.code === room.code)) {
      throw new Error('Mã phòng đã tồn tại');
    }
    if (rooms.some(r => r.name === room.name)) {
      throw new Error('Tên phòng đã tồn tại');  
    }

    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...rooms, newRoom]));
    return newRoom;
  },

  update: (id: string, room: Partial<Room>): Room => {
    const rooms = roomService.getAll();
    const index = rooms.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('Phòng không tồn tại');

    // Kiểm tra trùng (ngoại trừ bản ghi hiện tại)
    const existingRooms = rooms.filter(r => r.id !== id);
    if (room.code && existingRooms.some(r => r.code === room.code)) {
      throw new Error('Mã phòng đã tồn tại');
    }
    if (room.name && existingRooms.some(r => r.name === room.name)) {
      throw new Error('Tên phòng đã tồn tại');
    }

    const updatedRoom = {
      ...rooms[index],
      ...room,
      updatedAt: new Date().toISOString()
    };

    rooms[index] = updatedRoom;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    
    return updatedRoom;
  },

  delete: (id: string): void => {
    const rooms = roomService.getAll();
    const room = rooms.find(r => r.id === id);
    
    if (!room) throw new Error('Phòng không tồn tại');
    if (room.capacity >= 30) {
      throw new Error('Không thể xóa phòng có sức chứa từ 30 chỗ trở lên');
    }

    localStorage.setItem(STORAGE_KEY, 
      JSON.stringify(rooms.filter(r => r.id !== id))
    );
  },

  // Mock data cho staff
  getStaffs: (): Staff[] => [
    { id: '1', name: 'Nguyễn Văn A', email: 'a@example.com' },
    { id: '2', name: 'Trần Thị B', email: 'b@example.com' },
    { id: '3', name: 'Lê Văn C', email: 'c@example.com' },
  ]
};