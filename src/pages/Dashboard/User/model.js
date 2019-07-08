import { agent, fetch, trend, fetchAgent } from '@/services/wallet';
import enhancedModelExtend, { advancedList } from '@/utils/extend';

export default enhancedModelExtend(advancedList, {
  namespace: 'wallet',

  state: {
    userInfo: {},
    agentData: [],
    trendData: [],
  },

  effects: {
    *fetch(_, { call, put, all }) {
      const [agentData, userData, trendData] = yield all([call(agent), call(fetch), call(trend)]);
      if (trendData.status === 'ok' && userData.status === 'ok' && agentData.status === 'ok') {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: userData.data,
            trendData: trendData.data,
            agentData: agentData.data,
          },
        });
      }
    },
    *fetchAgents({ payload }, { call, put }) {
      const { page, size, sort, ...filter } = payload;
      const data = yield call(fetchAgent, payload);
      if (data.status === 'ok') {
        yield put({
          type: 'listSuccess',
          payload: {
            list: data.data.records,
            pagination: {
              current: Number(page) || 1,
              pageSize: Number(size) || 10,
              total: data.data.recordsFiltered || data.data.filter_count,
            },
            filter,
            sort: sort || '',
          },
        });
      }
    },
    *fetchTrend({ payload }, { call, put, all }) {
      const [agentData, trendData] = yield all([call(agent, payload), call(trend, payload)]);
      if (trendData.status === 'ok' && agentData.status === 'ok') {
        yield put({
          type: 'updateState',
          payload: {
            trendData: trendData.data,
            agentData: agentData.data,
          },
        });
      }
    },
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname } = location;
        if (pathname === '/dashboard/user') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
});
