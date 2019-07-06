import { agent, fetch, trend } from '@/services/wallet';

export default {
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

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

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
};
