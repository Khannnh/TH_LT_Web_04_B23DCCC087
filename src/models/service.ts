export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    category?: string;
    image?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }