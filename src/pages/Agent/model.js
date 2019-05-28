import { parse } from 'qs';
import enhancedModelExtend, { advancedList } from '@/utils/extend';
import { fetch, create, remove, update, activate } from '@/services/agent';

export default enhancedModelExtend(advancedList, {
  namespace: 'agent',

  state: {
    modalVisible: false,
    modalType: 'create',
    currentItem: {},
    roleType: '',
    roleSelection: [],
    customerSelection: [],
    unitSelection: [],
    submitting: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { page, size, sort, ...filter } = payload;
      const data = yield call(fetch, payload);
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
    *onCreate(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalType: 'create',
        },
      });
    },
    *create({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: { submitting: true },
      });
      const data = yield call(create, payload);
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
    *onUpdate({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
          modalType: 'update',
          currentItem: payload,
        },
      });
    },
    *update({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: { submitting: true },
      });
      const { currentItem } = yield select(({ users }) => users);
      const { user_uuid } = currentItem;
      const data = yield call(update, { ...payload, user_uuid });
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
    *activate({ payload }, { call, put }) {
      const data = yield call(activate, payload);
      if (data.status) {
        yield put({
          type: 'refreshPage',
          next: 'fetch',
        });
      }
    },
    *remove({ payload }, { call, put, select }) {
      const {
        pagination: { total },
      } = yield select(({ users }) => users);
      const data = yield call(remove, payload);
      if (data.status) {
        yield put({
          type: 'refreshPage',
          total,
          next: 'fetch',
        });
      }
    },
  },

  reducers: {},

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        if (pathname === '/agent') {
          const payload = parse(search, { ignoreQueryPrefix: true });
          dispatch({ type: 'fetch', payload });
        }
      });
    },
  },
});
