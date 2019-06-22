import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { handleRefresh } from '@/pages/_utils/utils';
import Search from './components/Search';
import List from './components/List';

const Index = ({ location, dispatch, userorder, fetching }) => {
  const { list, pagination, filter, sort } = userorder;

  // 搜索组件
  const searchProps = {
    filter,
    onOk(query) {
      handleRefresh(dispatch, location, { type: 'search', query });
    },
    onReset() {
      handleRefresh(dispatch, location, { type: 'search' });
    },
  };

  const listProps = {
    list,
    loading: fetching,
    pagination,
    sort,
    handleChange(query) {
      handleRefresh(dispatch, location, { type: 'list', query });
    },
  };

  return (
    <Card bordered={false}>
      <div className="tableListPage">
        <div className="tableSearchForm">
          <Search {...searchProps} />
        </div>
        <List {...listProps} />
      </div>
    </Card>
  );
};

const mapStateToProps = ({ userorder, loading }) => ({
  userorder,
  fetching: loading.effects['userorder/fetch'],
});

export default connect(mapStateToProps)(Index);
