import React from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Print from '@/components/Print';
import { handleRefresh } from '@/pages/_utils/utils';
import Search from './components/Search';
import List from './components/List';

class Order extends React.Component {
  state = {};

  render() {
    const { location, dispatch, order, fetching } = this.props;
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
      <PageHeaderWrapper title="订单管理">
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
            <div>
              <List {...listProps} />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ order, loading }) => ({
  order,
  fetching: loading.effects['order/fetch'],
});

export default connect(mapStateToProps)(Order);
