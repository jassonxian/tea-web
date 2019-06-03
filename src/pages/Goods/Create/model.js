import { message } from 'antd';
import router from 'umi/router';
import { createGoods } from '@/services/goods';
import { fetchBrand, fetchCategory } from '@/services/tags';
import enhancedModelExtend, { common } from '@/utils/extend';

export default enhancedModelExtend(common, {
  namespace: 'creategoods',

  state: {
    categoryData: [],
    brandData: [],
  },

  effects: {
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
    *create({ payload }, { call, put, select }) {
      const state = yield select(({ creategoods }) => creategoods);
      const { report_id } = state;
      let sendDate = {};
      if (report_id || report_id === 0) {
        sendDate = {
          ...payload,
          report_id,
        };
      } else {
        sendDate = payload;
      }
      const data = yield call(createGoods, sendDate);
      if (data.status) {
        message.success('创建成功', 2);
        yield put(router.push('/goods'));
      } else {
        message.error(data.msg, 2);
      }
    },
  },
  reducers: {
    AttachmentFix(state, { payload }) {
      const {
        item: { report_path, report_id },
      } = payload;
      const attachmentFix = (report_path || []).map((file, i) => ({
        uid: i,
        name: file[1],
        url: `/api/report/download/attachment?report_id=${report_id}&file_path=${file[0]}`,
        status: 'done',
        filePath: file[0],
      }));
      return {
        ...state,
        item: {
          ...payload.item,
          report_path: attachmentFix,
        },
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/goods/create') {
          dispatch({ type: 'fetchBrand' });
          dispatch({ type: 'fetchCategory' });
        }
      });
    },
  },
});
