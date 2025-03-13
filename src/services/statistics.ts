import { request } from 'umi';

export async function getStatistics(params: {
  startDate: string;
  endDate: string;
}) {
  return request('/api/statistics', {
    method: 'GET',
    params,
  });
}

export async function getEmployeeStatistics(params: {
  employeeId: string;
  startDate: string;
  endDate: string;
}) {
  return request('/api/statistics/employee', {
    method: 'GET',
    params,
  });
}

export async function getServiceStatistics(params: {
  serviceId: string;
  startDate: string;
  endDate: string;
}) {
  return request('/api/statistics/service', {
    method: 'GET',
    params,
  });
}