import { parse } from 'qs';
import enhancedModelExtend, { advancedList } from '@/utils/extend';
import { fetch, fetchSub } from '@/services/order';

export default enhancedModelExtend(advancedList, {
  namespace: 'userorder',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const { size, page, sort, ...filter } = payload;
      const data = yield call(fetch, { ...payload });
      if (data.status) {
        yield put({
          type: 'listSuccess',
          payload: {
            list: data.data.records,
            pagination: {
              current: Number(page) || 1,
              pageSize: Number(size) || 10,
              total: data.data.filter_count,
            },
            filter,
            sort: sort || '',
          },
        });
      }
    },
    *fetchSub({ payload }, { call, put }) {
      const { size, page, sort, ...filter } = payload;
      const data = yield call(fetchSub, { ...payload });
      if (data.status) {
        yield put({
          type: 'listSuccess',
          payload: {
            list: data.data.records,
            pagination: {
              current: Number(page) || 1,
              pageSize: Number(size) || 10,
              total: data.data.filter_count,
            },
            filter,
            sort: sort || '',
          },
        });
      }
    },
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        if (pathname === '/userorder/main') {
          const payload = parse(search, { ignoreQueryPrefix: true });
          dispatch({
            type: 'updateState',
            payload: {
              list: [],
            },
          });
          dispatch({ type: 'fetch', payload });
        }
        if (pathname === '/userorder/sub') {
          const payload = parse(search, { ignoreQueryPrefix: true });
          dispatch({
            type: 'updateState',
            payload: {
              list: [],
            },
          });
          dispatch({ type: 'fetchSub', payload });
        }
      });
    },
  },
});
