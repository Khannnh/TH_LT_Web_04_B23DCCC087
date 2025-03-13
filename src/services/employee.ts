import { request } from 'umi';
import type { Employee } from '@/models/employee';

export async function getEmployees(params?: any) {
  return request('/api/employees', {
    method: 'GET',
    params,
  });
}

export async function getEmployeeById(id: string) {
  return request(`/api/employees/${id}`, {
    method: 'GET',
  });
}

export async function createEmployee(data: Partial<Employee>) {
  return request('/api/employees', {
    method: 'POST',
    data,
  });
}

export async function updateEmployee(id: string, data: Partial<Employee>) {
  return request(`/api/employees/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteEmployee(id: string) {
  return request(`/api/employees/${id}`, {
    method: 'DELETE',
  });
}

export async function getEmployeeSchedule(employeeId: string, date: string) {
  return request(`/api/employees/${employeeId}/schedule`, {
    method: 'GET',
    params: { date },
  });
}