import { request } from 'umi';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
}

export async function getServices(params?: Record<string, any>) {
  return request<{ data: API.Service[] }>('/api/services', {
    method: 'GET',
    params,
  });
}

export async function createService(data: Partial<API.Service>) {
  return request<{ data: API.Service }>('/api/services', {
    method: 'POST',
    data,
  });
}

export async function updateService(id: string, data: Partial<API.Service>) {
  return request<{ data: API.Service }>(`/api/services/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteService(id: string) {
  return request<{ success: boolean }>(`/api/services/${id}`, {
    method: 'DELETE',
  });
}