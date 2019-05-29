import request from '../utils/request';

export async function fetchBrand(params) {
  return request('/api/goods/brand', {
    method: 'get',
    body: params,
  });
}

export async function createBrand(params) {
  return request('/api/goods/brand', {
    method: 'post',
    body: params,
  });
}

export async function removeBrand(params) {
  return request('/api/goods/brand', {
    method: 'delete',
    body: params,
  });
}

export async function fetchCategory(params) {
  return request('/api/goods/brand', {
    method: 'get',
    body: params,
  });
}

export async function createCategory(params) {
  return request('/api/goods/brand', {
    method: 'post',
    body: params,
  });
}

export async function removeCategory(params) {
  return request('/api/goods/brand', {
    method: 'delete',
    body: params,
  });
}
