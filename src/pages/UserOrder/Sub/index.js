import React from 'react';
import { connect } from 'dva';
import { Button, Card } from 'antd';
import Print from '@/components/Print';
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
  /* eslint-disable */
  const printRender = (
    <div>
      <table border="1" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>订单编号</th>
            <th style={{ textAlign: 'center' }}>订单金额</th>
            <th style={{ textAlign: 'center' }}>创建时间</th>
          </tr>
        </thead>
        <tbody>
          {list.map(item => {
            return (
              <tr>
                <td style={{ textAlign: 'center' }}>{item.order_code}</td>
                <td style={{ textAlign: 'center' }}>{`¥${item.order_price}`}</td>
                <td style={{ textAlign: 'center' }}>{item.create_time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  return (
    <Card bordered={false}>
      <div className="tableListPage">
        <div className="tableSearchForm">
          <Search {...searchProps} />
        </div>
        <div className="tableListOperator">
          {printRender ? (
            <Print trigger={<Button icon="printer">打印</Button>} content={printRender} />
          ) : null}
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
