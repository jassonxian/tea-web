import fetch from '@/services/wallet';

export default {
  namespace: 'wallet',

  state: {
    userInfo: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const data = yield call(fetch);
      console.log(data);
      if (data.status === 'ok') {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: data.data.records[0],
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
