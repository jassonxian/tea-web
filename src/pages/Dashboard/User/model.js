import fetch from '@/services/wallet';

export default {
  namespace: 'wallet',

  state: {},

  effects: {
    *fetch(_, { call }) {
      console.log('ssss');
      const data = yield call(fetch);
      if (data.status) {
        // yield put({
        //     type: 'updateState'
        // })
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
        console.log(pathname);
        if (pathname === '/dashboard/user') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
