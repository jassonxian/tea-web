import React from 'react';
import { connect } from 'dva';
import { Card, Divider, Tag, Button, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Goods/Index/index.less';

const { Description } = DescriptionList;

class Details extends React.Component {
  state = {};

  render() {
    const { orderDetails } = this.props;
    const { item, order_id, address } = orderDetails;
    const showImg = value => {
      if (value.made_picture) {
        return (
          <img
            style={{ width: 440 }}
            src={`/api/order/show/picture?order_id=${order_id}&filepath=${
              value.made_picture[0][0]
            }`}
            alt="暂无"
          />
        );
      }
      if (value.goods_list) {
        return (
          <img
            src={`/api/goods/picture?goods_id=${value.goods_list[0].goods_id}&filepath=${
              value.goods_list[0].goods_picture[0][0]
            }`}
            alt="暂无"
          />
        );
      }
      return null;
    };
    const action = [
      <Button
        key="1"
        onClick={() => {
          message.warning('暂未对接');
        }}
      >
        打印订单
      </Button>,
    ];
    return (
      <PageHeaderWrapper title="订单详情" action={action}>
        <Card bordered={false} title="商品详情">
          <DescriptionList className={styles.headerList} size="small" col="4">
            <Description term="商品类型">
              {item.made_picture ? <Tag>自定义商品</Tag> : <Tag>普通商品</Tag>}
            </Description>
            <Description term="商品名称">
              {item.made_picture
                ? '康华覆盆子茶'
                : item.goods_list
                ? item.goods_list[0].goods_name
                : '-'}
            </Description>
          </DescriptionList>
          {item.made_picture ? (
            <DescriptionList className={styles.headerList} size="small" col="1">
              <Description term="商品图片下载">
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
                    window.open(
                      `/api/order/show/picture?order_id=${order_id}&filepath=${
                        item.made_picture[0][0]
                      }`
                    )
                  }
                >
                  下载
                </Button>
              </Description>
            </DescriptionList>
          ) : null}
          <div className={styles.showImg} style={{ marginTop: 8 }}>
            {showImg(item)}
          </div>
          <Divider orientation="left">订单详情</Divider>
          <DescriptionList className={styles.headerList} size="small" col="1">
            <Description term="订单创建时间">{item.create_time}</Description>
            <Description term="付款金额">{`￥${item.order_price}`}</Description>
            {item.order_status !== 1 ? (
              <Description term="订单支付时间">{item.pay_time}</Description>
            ) : null}
            <Description term="收货人地址">
              {address.province} {address.city} {address.county}
            </Description>
            <Description term="收货人详细地址">{address.address || '-'}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ orderDetails, loading }) => ({
  orderDetails,
  fetching: loading.effects['orderDetails/fetch'],
});

export default connect(mapStateToProps)(Details);
