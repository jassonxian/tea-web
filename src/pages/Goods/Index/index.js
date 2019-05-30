import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { handleRefresh } from '@/pages/_utils/utils';
import Search from './components/Search';
import List from './components/List';

const Goods = ({ location, dispatch, goods, fetching }) => {
  const { list, pagination, filter, sort, categoryData, brandData } = goods;
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
    onRemove(item) {
      dispatch({
        type: 'goods/remove',
        payload: {
          goods_id: Number(item.goods_id),
        },
      });
    },
  };
  const onCreate = () => {
    router.push('/goods/create');
  };
  return (
    <PageHeaderWrapper title="信息流转">
      <Card bordered={false}>
        <div className="tableListPage">
          <div className="tableSearchForm">
            <Search {...searchProps} />
          </div>
          <div className="tableListOperator">
            <Button icon="plus" type="primary" onClick={onCreate} style={{ marginRight: 24 }}>
              新建
            </Button>
          </div>
          <List {...listProps} />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ goods, loading }) => ({
  goods,
  fetching: loading.effects['goods/fetch'],
});

export default connect(mapStateToProps)(Goods);
