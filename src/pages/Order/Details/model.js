import { parse } from 'qs';
import { fetchDetails, address } from '@/services/order';
import { fetchBrand, fetchCategory } from '@/services/tags';
import enhancedModelExtend, { common } from '@/utils/extend';

export default enhancedModelExtend(common, {
  namespace: 'orderDetails',

  state: {
    item: {},
    address: {},
    order_id: undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { order_list_id } = payload;
      const data = yield call(fetchDetails, payload);
      if (data.status === 'ok') {
        yield put({
          type: 'updateState',
          payload: {
            item: data.data,
            order_id: order_list_id,
          },
        });
        const addressData = yield call(address, { address_id: data.data.address_id });
        if (addressData.status === 'ok') {
          yield put({
            type: 'updateState',
            payload: {
              address: addressData.data,
            },
          });
        }
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
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        if (pathname === '/order/details') {
          const payload = parse(search, { ignoreQueryPrefix: true });
          dispatch({ type: 'fetch', payload });
        }
      });
    },
  },
});
