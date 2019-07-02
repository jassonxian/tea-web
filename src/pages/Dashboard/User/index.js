import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';
import logo from './user.png';

@connect(({ loading, user, wallet }) => ({
  currentUser: user.currentUser,
  wallet,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  fetching: loading.effects['wallet/fetch'],
}))
class Wallet extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  render() {
    const { currentUser, currentUserLoading } = this.props;
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={logo} />
                    <div className={styles.name}>{currentUser.agent_name}</div>
                    <div>{currentUser.username}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <Icon type="idcard" />
                      {currentUser.agent_code}
                    </p>
                  </div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card bordered={false}>asdsasdasdasdas</Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Wallet;
