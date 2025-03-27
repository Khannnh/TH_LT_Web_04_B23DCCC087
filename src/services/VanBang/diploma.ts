import { request } from 'umi';
import type { DiplomaBook, GraduationDecision, DiplomaField, Diploma, DiplomaSearchParams } from '@/types/diploma';

export async function getDiplomaBooks() {
  return request<{ data: DiplomaBook[] }>('/api/diploma-books');
}

export async function createDiplomaBook(year: number) {
  return request<{ data: DiplomaBook }>('/api/diploma-books', {
    method: 'POST',
    data: { year },
  });
}

export async function getDiplomaBookDetail(id: string) {
  return request<{ data: DiplomaBook }>(`/api/diploma-books/${id}`);
}

export async function getGraduationDecisions() {
  return request<{ data: GraduationDecision[] }>('/api/graduation-decisions');
}

export async function createGraduationDecision(data: Omit<GraduationDecision, 'id' | 'createdAt' | 'updatedAt'>) {
  return request<{ data: GraduationDecision }>('/api/graduation-decisions', {
    method: 'POST',
    data,
  });
}

export async function updateGraduationDecision(id: string, data: Partial<GraduationDecision>) {
  return request<{ data: GraduationDecision }>(`/api/graduation-decisions/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteGraduationDecision(id: string) {
  return request(`/api/graduation-decisions/${id}`, {
    method: 'DELETE',
  });
}

export async function getDiplomaFields() {
  return request<{ data: DiplomaField[] }>('/api/diploma-fields');
}

export async function createDiplomaField(data: Omit<DiplomaField, 'id' | 'createdAt' | 'updatedAt'>) {
  return request<{ data: DiplomaField }>('/api/diploma-fields', {
    method: 'POST',
    data,
  });
}

export async function updateDiplomaField(id: string, data: Partial<DiplomaField>) {
  return request<{ data: DiplomaField }>(`/api/diploma-fields/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteDiplomaField(id: string) {
  return request(`/api/diploma-fields/${id}`, {
    method: 'DELETE',
  });
}

export async function getDiplomas(params?: DiplomaSearchParams) {
  return request<{ data: Diploma[] }>('/api/diplomas', {
    params,
  });
}

export async function createDiploma(data: Omit<Diploma, 'id' | 'createdAt' | 'updatedAt'>) {
  return request<{ data: Diploma }>('/api/diplomas', {
    method: 'POST',
    data,
  });
}

export async function updateDiploma(id: string, data: Partial<Diploma>) {
  return request<{ data: Diploma }>(`/api/diplomas/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteDiploma(id: string) {
  return request(`/api/diplomas/${id}`, {
    method: 'DELETE',
  });
}

export async function searchDiplomas(params: DiplomaSearchParams) {
  return request<{ data: Diploma[] }>('/api/diplomas/search', {
    params,
  });
}

export async function updateSearchCount(graduationDecisionId: string) {
  return request<{ success: boolean }>('/api/graduation-decisions/search-count', {
    method: 'POST',
    data: { graduationDecisionId },
  });
}
