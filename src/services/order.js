import request from '@/utils/request';

export async function fetch(params) {
  return request('/api/order/agent', {
    method: 'GET',
    params,
  });
}

export async function fetchDetails(params) {
  return request('/api/order/agent/details', {
    method: 'get',
    params,
  });
}
