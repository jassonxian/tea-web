import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/agent/current');
}

export async function queryWallet(params) {
  return request('/api/agent_wallet', {
    method: 'GET',
    params,
  });
}
