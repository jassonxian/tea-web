import React from 'react';
import { Table } from 'antd';
import { recoverSort } from '@/pages/_utils/utils';

const List = ({ list, loading, pagination, handleChange, sort }) => {
  const dataSource = list.map(item => ({
    ...item,
    key: item.order_id,
  }));

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'order_code',
      key: 'order_code',
    },
    {
      title: '订单金额',
      key: 'order_price',
      dataIndex: 'order_price',
      render: text => {
        return `¥ ${text}`;
      },
    },
    {
      title: '订单状态',
      key: 'order_status',
      dataIndex: 'order_status',
      render: text => {
        let status;
        switch (text) {
          case 1:
            status = '待付款';
            break;
          case 2:
            status = '待发货';
            break;
          case 3:
            status = '已发货';
            break;
          case 4:
            status = '已完成';
            break;
          default:
            status = '订单有误';
            break;
        }
        return status;
      },
    },
    {
      title: '创建时间',
      key: 'create_time',
      dataIndex: 'create_time',
      align: 'center',
    },
  ];

  const onChange = (tablePagination, tableFilter, tableSort) => {
    const tableState = {
      page: tablePagination.current,
      size: tablePagination.pageSize,
    };
    if (tableSort.order) {
      tableState.sort = tableSort.order === 'ascend' ? tableSort.field : `-${tableSort.field}`;
    }
    handleChange(tableState);
  };

  return (
    <Table
      columns={recoverSort(columns, sort)}
      loading={loading}
      dataSource={dataSource}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default List;
