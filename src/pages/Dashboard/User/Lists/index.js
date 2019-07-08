import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import List from './List';

@connect(({ loading, user, wallet }) => ({
  currentUser: user.currentUser,
  wallet,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  fetching: loading.effects['wallet/fetchAgents'],
}))
class Lists extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wallet/fetchAgents',
      payload: {},
    });
  }

  render() {
    const { dispatch, wallet, fetching } = this.props;
    const { list } = wallet;
    const listProps = {
      dispatch,
      list,
      loading: fetching,
    };
    return (
      <Card bordered={false}>
        <div className="tableListPage">
          <div>
            <List {...listProps} />
          </div>
        </div>
      </Card>
    );
  }
}

export default Lists;
