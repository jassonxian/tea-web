import request from '@/utils/request';

export async function fetch() {
  return request('/api/agent');
}

export async function create(params) {
  return request('/api/agent', {
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
  return request('/api/agent', {
    method: 'POST',
    data: params,
  });
}
