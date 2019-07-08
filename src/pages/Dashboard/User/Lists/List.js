import React from 'react';
import { Table } from 'antd';
import { recoverSort } from '@/pages/_utils/utils';

const List = ({ list, loading, sort }) => {
  const dataSource = list.map(item => ({
    ...item,
    key: item.order_id,
  }));
  const columns = [
    {
      title: '代理商名称',
      dataIndex: 'agent_name',
      key: 'agent_name',
    },

    {
      title: '当月提成',
      key: 'money',
      dataIndex: 'money',
      render: text => {
        return `¥ ${text}`;
      },
    },
  ];

  return <Table columns={recoverSort(columns, sort)} loading={loading} dataSource={dataSource} />;
};

export default List;
