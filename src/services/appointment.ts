import { request } from 'umi';
import type { Appointment } from '@/models/appointment';

export async function getAppointments(params?: any) {
  return request('/api/appointments', {
    method: 'GET',
    params,
  });
}

export async function getAppointmentById(id: string) {
  return request(`/api/appointments/${id}`, {
    method: 'GET',
  });
}

export async function createAppointment(data: Partial<Appointment>) {
  return request('/api/appointments', {
    method: 'POST',
    data,
  });
}

export async function updateAppointment(id: string, data: Partial<Appointment>) {
  return request(`/api/appointments/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteAppointment(id: string) {
  return request(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
}

export async function checkAvailability(params: {
  employeeId: string;
  date: string;
  startTime: string;
}) {
  return request('/api/appointments/check-availability', {
    method: 'GET',
    params,
  });
}