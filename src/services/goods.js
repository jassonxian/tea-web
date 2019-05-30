import request from '@/utils/request';

export async function fetchGoods() {
  return request('/api/goods', {
    method: 'GET',
  });
}

export async function createGoods(params) {
  return request('/api/goods', {
    method: 'POST',
    data: params,
  });
}

export async function removeGoods(params) {
  return request('/api/goods', {
    method: 'DELETE',
    data: params,
  });
}
