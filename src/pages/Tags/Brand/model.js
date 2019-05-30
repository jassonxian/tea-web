import enhancedModelExtend, { basicList, refreshable } from '@/utils/extend';
import { fetchBrand, removeBrand, createBrand } from '@/services/tags';

export default enhancedModelExtend([basicList, refreshable], {
  namespace: 'brand',
  state: {
    modalVisible: false,
    submitting: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const data = yield call(fetchBrand);
      if (data.status === 'ok') {
        yield put({
          type: 'updateState',
          payload: {
            list: data.data.records,
          },
        });
      }
    },
    *onCreate(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
        },
      });
    },
    *create({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: { submitting: true },
      });
      const data = yield call(createBrand, payload);
      yield put({
        type: 'updateState',
        payload: { submitting: false },
      });
      if (data.status) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false,
          },
        });
        yield put({
          type: 'refreshPage',
          next: 'fetch',
        });
      }
    },
    *remove({ payload }, { call, put }) {
      yield call(removeBrand, payload);
      yield put({
        type: 'refreshPage',
        next: 'fetch',
      });
    },
  },

  reducers: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname } = location;
        if (pathname === '/tags/brand') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
});
