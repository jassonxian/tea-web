import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon } from 'antd';
import { getTimeDistance } from '@/utils/utils';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';
import logo from './user.png';

const SalesCard = React.lazy(() => import('../SalesCard'));

@connect(({ loading, user, wallet }) => ({
  currentUser: user.currentUser,
  wallet,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  fetching: loading.effects['wallet/fetch'],
}))
class Wallet extends PureComponent {
  state = {
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  getdata = () => {
    const salesData = [];
    for (let i = 0; i < 12; i += 1) {
      salesData.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200,
      });
    }
    return salesData;
  };

  render() {
    const { currentUser, currentUserLoading } = this.props;
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24} style={{ marginBottom: 24 }}>
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
        <Suspense fallback={null}>
          <SalesCard
            salesData={this.getdata()}
            isActive={this.isActive}
            selectDate={this.selectDate}
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default Wallet;
