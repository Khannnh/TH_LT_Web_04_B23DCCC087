export interface Review {
    id: string;
    appointmentId: string;
    employeeId: string;
    serviceId: string;
    rating: number; // 1-5
    comment: string;
    reply?: string;
    createdAt: string;
    updatedAt: string;
  }