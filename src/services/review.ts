import { request } from 'umi';
import type { Review } from '@/models/review';

export async function getReviews(params?: any) {
  return request('/api/reviews', {
    method: 'GET',
    params,
  });
}

export async function getReviewById(id: string) {
  return request(`/api/reviews/${id}`, {
    method: 'GET',
  });
}

export async function createReview(data: Partial<Review>) {
  return request('/api/reviews', {
    method: 'POST',
    data,
  });
}

export async function updateReview(id: string, data: Partial<Review>) {
  return request(`/api/reviews/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteReview(id: string) {
  return request(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
}