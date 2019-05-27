import { routerRedux } from 'dva/router';
import dvaModelExtend from 'dva-model-extend';
import { parse, stringify } from 'qs';
import { dataType } from './utils';

/**
 * dva model extend enhancer
 * @param sources
 * @param target
 */
function enhancedModelExtend(sources, target) {
  if (dataType(target) !== 'object') {
    throw new TypeError('Target must be an Object');
  }

  if (dataType(sources) === 'object') {
    return dvaModelExtend(sources, target);
  }
  if (dataType(sources) === 'array') {
    let model = target;
    sources.forEach(source => {
      if (dataType(source) !== 'object') {
        throw new TypeError('Every source must be an Object');
      }
      model = dvaModelExtend(source, model);
    });
    return model;
  }

  throw new TypeError('Sources must be an Object or an Array');
}

/*
 * 基本模型定义
 *
 *
 * 通用模型 common
 * 列表模型 list
 * 分页模型 paginate
 * 搜索模型 filterable
 * 排序模型 sortable
 *
 * */

const common = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

const listable = {
  state: {
    list: [],
  },
};

const paginate = {
  state: {
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共有 ${total} 条记录`,
    },
  },
  reducers: {
    listSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
        pagination: {
          ...state.pagination,
          ...payload.pagination,
        },
      };
    },
  },
};

const filterable = {
  state: {
    filter: {},
  },
};

const sortable = {
  state: {
    sort: '',
  },
};

const refreshable = {
  effects: {
    /**
     * 删除、忽略，table根据选择数量page自动调整
     * @param next 需要执行的操作
     * @param total table总条数
     * @param length 操作条数 默认为1
     */
    *refreshPage({ next, total, length = 1 }, { select, put }) {
      const data = yield select(({ routing }) => routing);
      const {
        location: { search, pathname },
      } = data;
      let payload = parse(search, { ignoreQueryPrefix: true });

      if (total) {
        const page =
          Math.ceil((total - length) / payload.size) < payload.page - 0
            ? Math.ceil((total - length) / payload.size)
            : payload.page;
        payload = {
          ...payload,
          page: page || 1,
        };
        yield put(
          routerRedux.replace({
            pathname,
            search: stringify(payload),
          })
        );
      }
      yield put({ type: next, payload });
    },
  },
};

const basicList = enhancedModelExtend(common, listable);
const advancedList = enhancedModelExtend(
  [common, paginate, filterable, sortable, refreshable],
  listable
);

export default enhancedModelExtend;
export {
  common,
  listable,
  paginate,
  filterable,
  sortable,
  refreshable,
  basicList,
  advancedList,
};
