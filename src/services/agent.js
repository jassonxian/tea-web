import request from '@/utils/request';

export async function fetch() {
  return request('/api/agent', {
    method: 'GET',
  });
}

export async function create(params) {
  return request('/api/register/agent', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request('/api/agent', {
    method: 'DELETE',
    data: params,
  });
}

export async function update(params) {
  return request('/api/agent', {
    method: 'POST',
    data: params,
  });
}

export async function activate(params) {
  return request('/api/agent/activate', {
    method: 'PATCH',
    data: params,
  });
}
