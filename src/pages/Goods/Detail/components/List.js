import React from 'react';
import { Table, Tag } from 'antd';
import { recoverSort } from '@/pages/_utils/utils';

const List = ({ list, loading, pagination, sort, handleChange }) => {
  const columns = [
    {
      title: '接收单位',
      dataIndex: 'unit_name',
      key: 'unit_name',
      align: 'center',
      render: text => {
        if (text) {
          return text;
        }
        return '——';
      },
    },
    {
      title: '报告状态',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      render: (text, record) => {
        if (record.confirm_time) {
          return <Tag color="#108ee9">已接收</Tag>;
        }
        return <Tag color="#f50">未接收</Tag>;
      },
    },
    {
      title: '接收时间',
      dataIndex: 'confirm_time',
      key: 'confirm_time',
      align: 'center',
      sorter: true,
      render: text => {
        if (text) {
          return text;
        }
        return '——';
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
      dataSource={list.map(item => ({ ...item, key: item.report_status_id }))}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default List;
