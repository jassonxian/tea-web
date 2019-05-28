import React from 'react';
import { Table } from 'antd';
import Operation from '@/components/Operation';
import { recoverSort } from '@/pages/_utils/utils';

const List = ({
  isActionsAllowable,
  role_group,
  list,
  loading,
  pagination,
  sort,
  handleChange,
  onUpdate,
  activate,
  remove,
  reset,
}) => {
  const auth = isActionsAllowable([
    'update-user',
    'remove-user',
    'activate-user',
    'reset-password',
  ]);
  const actions = record => {
    const acts = [];
    if (auth['update-user']) {
      acts.push({
        text: '编辑',
        primary: true,
        onAction: () => onUpdate(record),
      });
    }
    if (auth['activate-user'] && !record.activated) {
      acts.push({
        text: '激活',
        confirmer: {
          title: '确定激活该用户吗？',
          placement: 'topRight',
          onConfirm: () => activate({ user_uuid: record.user_uuid }),
        },
      });
    }
    if (auth['reset-password']) {
      acts.push({
        text: '重置密码',
        confirmer: {
          title: '确定重置该用户密码？',
          placement: 'topRight',
          onConfirm: () => reset({ user_uuid: record.user_uuid }),
        },
      });
    }
    if (auth['remove-user']) {
      acts.push({
        text: '删除',
        confirmer: {
          title: '确定删除该用户吗？',
          placement: 'topRight',
          onConfirm: () => remove({ user_uuid: record.user_uuid }),
        },
      });
    }
    return acts;
  };

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    {
      title: '单位',
      dataIndex: 'unit_name',
      key: 'unit_name',
      render: text => {
        return text === '暂无' || text === '' ? '——' : text;
      },
    },
    { title: '手机', dataIndex: 'phone', key: 'phone', align: 'center' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '操作',
      key: 'operations',
      width: 128,
      align: 'center',
      render: (text, record) => {
        return <Operation actions={actions(record)} />;
      },
    },
  ];
  if (role_group === 'system' || role_group === 'devops') {
    columns.splice(2, 0, { title: '角色', dataIndex: 'role_name', key: 'role_name' });
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
      dataSource={list.map(item => ({ ...item, key: item.user_uuid }))}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default List;
