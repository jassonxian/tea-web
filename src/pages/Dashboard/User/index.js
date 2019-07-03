import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import { Card, Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { getTimeDistance } from '@/utils/utils';
import Yuan from '@/utils/Yuan';
import { ChartCard, Field } from '@/components/Charts';
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
    const { currentUser, currentUserLoading, wallet } = this.props;
    const { userInfo } = wallet;
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={8} md={24}>
            <Card
              bordered={false}
              style={{ marginBottom: 24, height: 249 }}
              loading={currentUserLoading}
            >
              {currentUser && Object.keys(currentUser).length ? (
                <div className={styles.avatarHolder}>
                  <img alt="" src={logo} />
                  <div className={styles.name}>{currentUser.agent_name}</div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Card
              bordered={false}
              style={{ marginBottom: 24, height: 249 }}
              loading={currentUserLoading}
            >
              <div className={styles.detail}>
                <p>
                  <Icon type="user" />
                  {userInfo.username}
                </p>
                <p>
                  <Icon type="idcard" style={{ fontSize: 20 }} />
                  {userInfo.agent_code}
                </p>
                <p>
                  <Icon type="phone" style={{ fontSize: 20 }} />
                  {userInfo.phone}
                </p>
              </div>
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <ChartCard
              style={{ height: 249 }}
              bordered={false}
              title={
                <FormattedMessage id="app.analysis.total-sales" defaultMessage="Total Sales" />
              }
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <Yuan>126560</Yuan>}
              footer={
                <Field
                  label={
                    <FormattedMessage id="app.analysis.day-sales" defaultMessage="Daily Sales" />
                  }
                  value={`￥${numeral(12423).format('0,0')}`}
                />
              }
              contentHeight={46}
            />
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
