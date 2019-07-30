import React from 'react';
import { Table, Tag } from 'antd';
import router from 'umi/router';
import { isActionsAllowable } from '@/utils/authority';
import { recoverSort } from '@/pages/_utils/utils';
import Operation from '@/components/Operation';

const List = ({ list, loading, pagination, sort, handleChange, onRemove }) => {
  const dataSource = list.map(item => ({
    ...item,
    key: item.order_id,
  }));
  const opertions = record => {
    const actions = [
      {
        text: '详情',
        primary: true,
        onAction: () => router.push(`/order/details?order_list_id=${record.order_id}`),
      },
    ];
    if (record.order_status === 2) {
      actions.push({
        text: '打印',
        primary: true,
        onAction: () => console.log('print'),
      });
    }

    if (isActionsAllowable('admin')) {
      actions.push({
        text: '删除',
        confirmer: {
          title: '确定删除该订单吗？',
          placement: 'topRight',
          onConfirm: () => onRemove(record),
        },
      });
    }
    return <Operation actions={actions} />;
  };
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
            status = <Tag>待付款</Tag>;
            break;
          case 2:
            status = <Tag>待发货</Tag>;
            break;
          case 3:
            status = <Tag>已发货</Tag>;
            break;
          case 4:
            status = <Tag>已完成</Tag>;
            break;
          default:
            status = <Tag>订单有误</Tag>;
            break;
        }
        return status;
      },
    },
    {
      title: '商品名称',
      key: 'made_picture',
      dataIndex: 'made_picture',
      render: (text, record) => {
        if (text) {
          return <Tag color="#108ee9">自定义商品</Tag>;
        }
        return <Tag>{record.goods_list[0].goods_name}</Tag>;
      },
    },
    {
      title: '创建时间',
      key: 'create_time',
      dataIndex: 'create_time',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operations',
      width: 128,
      render: (text, record) => {
        return opertions(record);
      },
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
