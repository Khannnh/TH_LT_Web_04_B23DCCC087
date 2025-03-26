import { Classroom } from '@/models/phonghoc/classroom';

const STORAGE_KEY = 'classrooms';

export const classroomService = {
  getAll: (): Classroom[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: (classrooms: Classroom[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classrooms));
  },

  add: (classroom: Omit<Classroom, 'id'>): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const classrooms = classroomService.getAll();
        const newClassroom = {
          ...classroom,
          id: Math.random().toString(36).substr(2, 9),
        };

        // Kiểm tra mã phòng trùng lặp
        if (classrooms.some(c => c.roomCode === classroom.roomCode)) {
          reject(new Error('Mã phòng đã tồn tại'));
          return;
        }

        // Kiểm tra tên phòng trùng lặp
        if (classrooms.some(c => c.name === classroom.name)) {
          reject(new Error('Tên phòng đã tồn tại'));
          return;
        }

        // Đảm bảo capacity là số
        newClassroom.capacity = Number(newClassroom.capacity);

        classrooms.push(newClassroom);
        classroomService.save(classrooms);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  update: (id: string, classroom: Omit<Classroom, 'id'>): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const classrooms = classroomService.getAll();
        const index = classrooms.findIndex(c => c.id === id);

        if (index === -1) {
          reject(new Error('Không tìm thấy phòng học'));
          return;
        }

        // Kiểm tra mã phòng trùng lặp (trừ phòng hiện tại)
        if (classrooms.some(c => c.roomCode === classroom.roomCode && c.id !== id)) {
          reject(new Error('Mã phòng đã tồn tại'));
          return;
        }

        // Kiểm tra tên phòng trùng lặp (trừ phòng hiện tại)
        if (classrooms.some(c => c.name === classroom.name && c.id !== id)) {
          reject(new Error('Tên phòng đã tồn tại'));
          return;
        }

        // Đảm bảo capacity là số
        const updatedClassroom = {
          ...classroom,
          id,
          capacity: Number(classroom.capacity),
        };

        classrooms[index] = updatedClassroom;
        classroomService.save(classrooms);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  delete: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const classrooms = classroomService.getAll();
        const classroom = classrooms.find(c => c.id === id);

        if (!classroom) {
          reject(new Error('Không tìm thấy phòng học'));
          return;
        }

        if (classroom.capacity >= 30) {
          reject(new Error('Không thể xóa phòng có sức chứa từ 30 chỗ ngồi trở lên'));
          return;
        }

        const filteredClassrooms = classrooms.filter(c => c.id !== id);
        classroomService.save(filteredClassrooms);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
};
