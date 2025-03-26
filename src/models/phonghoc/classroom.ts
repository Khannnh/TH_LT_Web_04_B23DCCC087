export interface Classroom {
  id: string;
  roomCode: string;
  name: string;
  capacity: number;
  type: 'Lý thuyết' | 'Thực hành' | 'Hội trường';
  manager: string;
}

export interface ClassroomModel {
  classrooms: Classroom[];
  loading: boolean;
  error: string | null;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => Promise<void>;
  updateClassroom: (id: string, classroom: Omit<Classroom, 'id'>) => Promise<void>;
  deleteClassroom: (id: string) => Promise<void>;
  searchClassrooms: (query: string) => void;
  filterByType: (type: Classroom['type'] | null) => void;
  sortByCapacity: (ascending: boolean) => void;
}
