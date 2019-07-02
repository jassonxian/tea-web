import request from '../utils/request';

export default async function fetch(params) {
  return request('/api/agent_wallet', {
    method: 'get',
    data: params,
  });
}
