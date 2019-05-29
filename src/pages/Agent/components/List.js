import React from 'react';
import { Table } from 'antd';
import Operation from '@/components/Operation';
import { recoverSort } from '@/pages/_utils/utils';

const List = ({
  isActionsAllowable,
  list,
  loading,
  pagination,
  sort,
  handleChange,
  activate,
  remove,
}) => {
  const actions = record => {
    const acts = [
      {
        text: '删除',
        confirmer: {
          title: '确定删除该用户吗？',
          placement: 'topRight',
          onConfirm: () => remove({ user_uuid: record.user_uuid }),
        },
      },
    ];
    if (!record.activated) {
      acts.unshift({
        text: '激活',
        confirmer: {
          title: '确定激活该代理商吗？',
          placement: 'topRight',
          onConfirm: () => activate({ agent_code: record.agent_code }),
        },
      });
    }
    return acts;
  };

  const columns = [
    { title: '代理商名称', dataIndex: 'agent_name', key: 'agent_name' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '代理商编号', dataIndex: 'agent_code', key: 'agent_code' },
    { title: '手机', dataIndex: 'phone', key: 'phone', align: 'center' },
    { title: '创建时间', dataIndex: 'create_time', key: 'create_time', align: 'center' },
  ];
  if (isActionsAllowable('admin')) {
    columns.push({
      title: '操作',
      key: 'operations',
      width: 128,
      align: 'center',
      render: (text, record) => {
        return <Operation actions={actions(record)} />;
      },
    });
  }

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
      dataSource={list.map(item => ({ ...item, key: item.agent_id }))}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default List;
