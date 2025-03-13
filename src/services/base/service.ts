import { request } from 'umi';
import type { Service } from 'D:/code/basewebumiTH/src/models/service';

export async function getServices(params?: any) {
  return request('/api/services', {
    method: 'GET',
    params,
  });
}

export async function getServiceById(id: string) {
  return request(`/api/services/${id}`, {
    method: 'GET',
  });
}

export async function createService(data: Partial<Service>) {
  return request('/api/services', {
    method: 'POST',
    data,
  });
}

export async function updateService(id: string, data: Partial<Service>) {
  return request(`/api/services/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteService(id: string) {
  return request(`/api/services/${id}`, {
    method: 'DELETE',
  });
}