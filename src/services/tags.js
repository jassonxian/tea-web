import request from '../utils/request';

export async function fetchBrand(params) {
  return request('/api/goods/brand', {
    method: 'get',
    data: params,
  });
}

export async function createBrand(params) {
  return request('/api/goods/brand', {
    method: 'POST',
    data: params,
  });
}

export async function removeBrand(params) {
  return request('/api/goods/brand', {
    method: 'delete',
    data: params,
  });
}

export async function fetchCategory(params) {
  return request('/api/goods/category', {
    method: 'get',
    data: params,
  });
}

export async function createCategory(params) {
  return request('/api/goods/category', {
    method: 'post',
    data: params,
  });
}

export async function removeCategory(params) {
  return request('/api/goods/category', {
    method: 'delete',
    data: params,
  });
}
