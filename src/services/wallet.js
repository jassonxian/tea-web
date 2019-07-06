import request from '../utils/request';

export async function trend(params) {
  return request('/api/dashboard/trenol', {
    method: 'get',
    params,
  });
}

export async function fetch(params) {
  return request('/api/dashboard/user', {
    method: 'get',
    params,
  });
}

export async function agent(params) {
  return request('/api/dashboard/agent', {
    method: 'get',
    params,
  });
}
