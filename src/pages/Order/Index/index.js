import React from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Print from '@/components/Print';
import { handleRefresh } from '@/pages/_utils/utils';
import Search from './components/Search';
import List from './components/List';

class Order extends React.Component {
  state = {
    element1: null,
  };

  saveElement1 = node => {
    this.setState({
      element1: node,
    });
  };

  render() {
    const { location, dispatch, order, fetching } = this.props;
    const { element1 } = this.state;
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
    const printRender = () => {
      return (
        <div>
          <table border="1" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>姓名</th>
                <th style={{ textAlign: 'center' }}>年级</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>张三</td>
                <td style={{ textAlign: 'center' }}>一年级</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'center' }}>王五</td>
                <td style={{ textAlign: 'center' }}>二年级</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    };
    return (
      <PageHeaderWrapper title="订单管理">
        <Card bordered={false}>
          <div className="tableListPage">
            <div className="tableSearchForm">
              <Search {...searchProps} />
            </div>
            <div className="tableListOperator">
              {element1 ? (
                <Print trigger={<Button icon="printer">打印</Button>} content={element1} />
              ) : null}
            </div>
            <div ref={this.saveElement1}>
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
