export interface WorkingHours {
    dayOfWeek: number; // 0-6 for Sunday-Saturday
    startTime: string; // Format: "HH:mm"
    endTime: string;
  }
  
  export interface Employee {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
    services: string[]; // Array of service IDs
    maxCustomersPerDay: number;
    workingHours: WorkingHours[];
    rating: number;
    totalReviews: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }