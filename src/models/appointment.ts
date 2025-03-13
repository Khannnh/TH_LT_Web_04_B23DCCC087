import type { Employee } from 'D:/code/basewebumiTH/src/models/employee';
import type { Service } from 'D:/code/basewebumiTH/src/models/service';
import type { Customer } from './customer';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  employeeId: string;
  employee?: Employee;
  serviceId: string;
  service?: Service;
  customerId: string;
  customer?: Customer;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentAvailability {
  available: boolean;
  conflictingAppointments?: Appointment[];
} 