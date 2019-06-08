import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { handleRefresh } from '@/pages/_utils/utils';
import Search from './components/Search';
import List from './components/List';

const Order = ({ location, dispatch, order, fetching }) => {
  const { list, pagination, filter, sort, categoryData, brandData } = order;
  const searchProps = {
    filter,
    categoryData,
    brandData,
    onOk(values) {
      const query = {
        ...values,
      };
      handleRefresh(dispatch, location, { type: 'search', query });
    },
    onReset() {
      const query = {};
      handleRefresh(dispatch, location, { type: 'search', query });
    },
  };
  const listProps = {
    dispatch,
    list,
    loading: fetching,
    pagination,
    sort,
    handleChange(query) {
      handleRefresh(dispatch, location, { type: 'list', query });
    },
    refresh() {
      handleRefresh(dispatch, location, { type: 'refresh' });
    },
  };
  console.log(list);
  return (
    <PageHeaderWrapper title="订单管理">
      <Card bordered={false}>
        <div className="tableListPage">
          <div className="tableSearchForm">
            <Search {...searchProps} />
          </div>
          <List {...listProps} />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ order, loading }) => ({
  order,
  fetching: loading.effects['order/fetch'],
});

export default connect(mapStateToProps)(Order);
