import request from '../utils/request';

export async function fetch(params) {
  return request('/api/tags', {
    method: 'get',
    body: params,
  });
}

export async function create(params) {
  return request('/api/tags', {
    method: 'post',
    body: params,
  });
}

export async function remove(params) {
  return request('/api/tags', {
    method: 'delete',
    body: params,
  });
}

export async function update(params) {
  return request('/api/tags', {
    method: 'patch',
    body: params,
  });
}

export async function selection(params) {
  return request('/api/tags/selection', {
    method: 'get',
    body: params,
  });
}

export async function fetchReport(params) {
  return request('/api/tags/report', {
    method: 'get',
    body: params,
  });
}

export async function createReport(params) {
  return request('/api/tags/report', {
    method: 'post',
    body: params,
  });
}

export async function removeReport(params) {
  return request('/api/tags/report', {
    method: 'delete',
    body: params,
  });
}
