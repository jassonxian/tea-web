import { parse } from 'qs';
import { fetchGoods, removeGoods } from '@/services/goods';
import { fetchBrand, fetchCategory } from '@/services/tags';
import enhancedModelExtend, { advancedList } from '@/utils/extend';

export default enhancedModelExtend(advancedList, {
  namespace: 'goods',

  state: {
    categoryData: [],
    brandData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { page, size, sort, ...filter } = payload;
      const data = yield call(fetchGoods, payload);
      if (data.status) {
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
    *fetchBrand(_, { call, put }) {
      const data = yield call(fetchBrand);
      if (data.status) {
        yield put({
          type: 'updateState',
          payload: {
            brandData: data.data.records,
          },
        });
      }
    },
    *fetchCategory(_, { call, put }) {
      const data = yield call(fetchCategory);
      if (data.status) {
        yield put({
          type: 'updateState',
          payload: {
            categoryData: data.data.records,
          },
        });
      }
    },
    *remove({ payload }, { call, put, select }) {
      const {
        pagination: { total },
      } = yield select(({ goods }) => goods);
      yield call(removeGoods, payload);
      yield put({
        type: 'refreshPage',
        total,
        next: 'fetch',
      });
    },
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        if (pathname === '/goods') {
          const payload = parse(search, { ignoreQueryPrefix: true });
          dispatch({ type: 'fetch', payload });
          dispatch({ type: 'fetchBrand' });
          dispatch({ type: 'fetchCategory' });
        }
      });
    },
  },
});
