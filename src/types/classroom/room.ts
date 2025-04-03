export enum RoomType {
    THEORY = 'Lý thuyết',
    PRACTICE = 'Thực hành',
    HALL = 'Hội trường'
  }
  
  export interface Staff {
    id: string;
    name: string;
    email: string;
  }
  
  export interface Room {
    id: string;
    code: string;
    name: string;
    capacity: number;
    type: RoomType;
    managerId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface RoomFormValues extends Omit<Room, 'id' | 'createdAt' | 'updatedAt'> {}