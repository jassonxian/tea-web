import React from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';

const Search = ({ filter, unitSelection, roleSelection, ...rest }) => {
  const units = unitSelection.map(item => ({
    ...item,
    value: item.id,
    label: item.name,
  }));
  const roles = roleSelection.map(item => ({
    ...item,
    value: item.id,
    label: item.name,
  }));
  const advancedSearchProps = {
    filter,
    ...rest,
    searchFields: [
      {
        label: '角色',
        type: 'select',
        name: 'role_id',
        options: roles,
        inputProps: {
          showSearch: true,
          optionFilterProp: 'children',
          placeholder: '请输入角色名称',
        },
      },
      {
        label: '单位',
        type: 'select',
        name: 'unit_id',
        options: units,
        inputProps: {
          showSearch: true,
          optionFilterProp: 'children',
          placeholder: '请输入单位名称',
        },
      },
      {
        type: 'input',
        label: '姓名',
        name: 'name',
        inputProps: {
          placeholder: '请输入姓名',
        },
      },
      {
        type: 'input',
        label: '手机',
        name: 'phone',
        inputProps: {
          placeholder: '请输入手机号码',
        },
      },
      {
        type: 'input',
        label: '邮箱',
        name: 'email',
        inputProps: {
          placeholder: '请输入邮箱',
        },
      },
      // {
      //   label: '创建时间',
      //   type: 'range',
      //   name: 'create_time',
      //   inputProps: {
      //     format: 'YYYY-MM-DD HH:mm',
      //     placeholder: ['开始时间', '结束时间'],
      //   },
      // },
    ],
  };
  return <AdvancedSearch {...advancedSearchProps} />;
};

export default Search;
