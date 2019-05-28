import lodash from 'lodash';
import { routerRedux } from 'dva/router';
import { parse, stringify } from 'qs';
import { dataType } from '@/utils/utils';

export function recoverSort(columns, sort) {
  const sortedInfo = {
    order: 'ascend',
  };

  if (sort) {
    const prefix = sort.substr(0, 1);
    if (prefix !== '-') {
      sortedInfo.field = sort;
    } else {
      sortedInfo.order = 'descend';
      sortedInfo.field = sort.substr(1);
    }
  }
  if (dataType(columns) === 'array') {
    const cache = lodash.cloneDeep(columns);
    return cache.map(item =>
      item.sorter
        ? {
            ...item,
            sortOrder: sortedInfo.field === item.dataIndex && sortedInfo.order,
          }
        : item
    );
  }
  return [];
}

export function handleRefresh(dispatch, location, newQuery) {
  const { search, pathname } = location;
  const oldQuery = parse(search, { ignoreQueryPrefix: true });
  const { size, page, sort: oldSort, ...oldFilter } = oldQuery;

  let param;
  switch (newQuery.type) {
    case 'search':
      param = {
        ...newQuery.query,
        size,
      };
      break;
    case 'list':
      param = {
        ...oldFilter,
        ...newQuery.query,
      };
      break;
    case 'extend':
      param = {
        ...oldQuery,
        ...newQuery.query,
      };
      break;
    default:
      param = parse(search, { ignoreQueryPrefix: true });
      break;
  }

  dispatch(
    routerRedux.replace({
      pathname,
      search: stringify(param),
    })
  );
}

// 去除空属性
export function objEmpty(obj) {
  const newObj = Object.assign(obj, {});
  lodash.forIn(newObj, (value, key) => {
    if (value === '' || value === 'null') {
      delete newObj[key];
    }
  });
  return newObj;
}

export function difftime(date = 0) {
  const days = Math.floor(date / (24 * 3600 * 1000)); // 计算出相差天数
  const leave1 = date % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000)); // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000)); // 计算相差秒数
  const leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000);
  if (!minutes) return `${seconds}秒`;
  if (!hours) return `${minutes}分钟 ${seconds}秒`;
  if (!days) return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
  return `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
}

// 数组项为对象，父集数组减去子集数组（对象数组筛选）
export function getSubtract(unionArr, subsetArr) {
  const new_tmp = [];
  if (!unionArr || !subsetArr) return new_tmp;
  for (let i = 0; i < unionArr.length; i++) {
    let flag = true;
    for (let j = 0; j < subsetArr.length; j++) {
      if (lodash.isEqual(unionArr[i], subsetArr[j])) {
        flag = false;
      }
    }
    if (flag) {
      new_tmp.push(unionArr[i]);
    }
  }
  return new_tmp;
}
