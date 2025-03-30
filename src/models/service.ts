export interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string;
    active: boolean;
    duration: number; // in minutes
    status: 'active' | 'inactive';
  }