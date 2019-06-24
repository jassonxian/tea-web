import React from 'react';
import { Icon, Tooltip } from 'antd';
import { ChartCard, Field } from '@/components/Charts';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

export default () => {
  return (
    <ChartCard
      bordered={false}
      title="admin"
      action={
        <Tooltip title="kajsdkjaksjdk">
          <Icon type="info-circle-o" />
        </Tooltip>
      }
      loading={false}
      total={() => <Yuan>126560</Yuan>}
      footer={<Field label="kjaksjdkajsldjaklsj" value={`￥${numeral(12423).format('0,0')}`} />}
      contentHeight={46}
    />
  );
};
