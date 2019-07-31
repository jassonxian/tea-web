import { message } from 'antd';
import router from 'umi/router';
import { parse } from 'qs';
import { createGoods, goodsDetails, updateGoods } from '@/services/goods';
import { fetchBrand, fetchCategory } from '@/services/tags';
import enhancedModelExtend, { common } from '@/utils/extend';

export default enhancedModelExtend(common, {
  namespace: 'creategoods',

  state: {
    item: {},
    categoryData: [],
    brandData: [],
  },

  effects: {
    *fetchBrand(_, { call, put }) {
      const data = yield call(fetchBrand);
      if (data.status === 'ok') {
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
      if (data.status === 'ok') {
        yield put({
          type: 'updateState',
          payload: {
            categoryData: data.data.records,
          },
        });
      }
    },
    *updateGoods({ payload }, { call }) {
      const data = yield call(updateGoods, payload);
      if (data.status === 'ok') {
        message.success('更新成功', 2);
        router.goBack();
      } else {
        message.error(data.msg, 2);
      }
    },
    *create({ payload }, { call, put, select }) {
      const state = yield select(({ creategoods }) => creategoods);
      const { goods_id } = state;
      let sendDate = {};
      if (goods_id || goods_id === 0) {
        sendDate = {
          ...payload,
          goods_id,
        };
      } else {
        sendDate = payload;
      }
      const data = yield call(createGoods, sendDate);
      if (data.status === 'ok') {
        message.success('创建成功', 2);
        yield put(router.push('/goods'));
      } else {
        message.error(data.msg, 2);
      }
    },
    *fetchDetails({ payload }, { call, put }) {
      const { goods_id } = payload;
      if (goods_id) {
        const data = yield call(goodsDetails, { goods_id });
        if (data.status === 'ok') {
          yield put({
            type: 'updateState',
            payload: {
              item: data.data,
            },
          });
        }
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
      return history.listen(({ pathname, search }) => {
        if (pathname === '/goods/create') {
          dispatch({
            type: 'updateState',
            payload: {
              item: {},
            },
          });
          const payload = parse(search, { ignoreQueryPrefix: true });
          dispatch({
            type: 'fetchDetails',
            payload,
          });
          dispatch({ type: 'fetchBrand' });
          dispatch({ type: 'fetchCategory' });
        }
      });
    },
  },
});
