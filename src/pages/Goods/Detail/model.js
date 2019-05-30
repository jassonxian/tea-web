import { parse } from 'qs';
import enhancedModelExtend, { advancedList } from '@/utils/extend';
import { detail } from '@/services/report';

export default enhancedModelExtend(advancedList, {
  namespace: 'reportdetail',

  state: {
    item: {},
    report_id: '',
    showList: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { report_id, page, size, sort } = payload;
      if (report_id || report_id === 0) {
        const data = yield call(detail, payload);
        if (data.status) {
          yield put({
            type: 'listSuccess',
            payload: {
              item: data.data,
              report_id,
              showList: data.data.report_status_data || false,
              list:
                data.data.report_status_data && data.data.report_status_data.records
                  ? data.data.report_status_data.records
                  : [],
              pagination: {
                current: size || 1,
                pageSize: page || 10,
                total:
                  data.data.report_status_data && data.data.report_status_data.recordsFiltered
                    ? data.data.report_status_data.recordsFiltered
                    : 0,
              },
              sort: sort || '',
            },
          });
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname, search } = location;
        if (pathname === '/report/detail') {
          const payload = parse(search, { ignoreQueryPrefix: true });
          dispatch({
            type: 'fetch',
            payload,
          });
        }
      });
    },
  },
});
