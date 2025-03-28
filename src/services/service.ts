import { request } from 'umi';
import type { Service } from '@/models/service';

export const getServices = async (): Promise<Service[]> => {
  return request<{ data: Service[] }>('/api/services', {
    method: 'GET',
  }).then(response => response.data);
};

export const createService = async (data: Omit<Service, 'id'>): Promise<Service> => {
  return request<{ data: Service }>('/api/services', {
    method: 'POST',
    data,
  }).then(response => response.data);
};

export const updateService = async (id: string, data: Partial<Service>): Promise<Service> => {
  return request<{ data: Service }>(`/api/services/${id}`, {
    method: 'PUT',
    data,
  }).then(response => response.data);
};

export const deleteService = async (id: string): Promise<void> => {
  return request<{ success: boolean }>(`/api/services/${id}`, {
    method: 'DELETE',
  }).then(() => {});
};