declare namespace API {
  interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    status: 'active' | 'inactive';
  }
}