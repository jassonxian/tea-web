import React from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';

const Search = ({ filter, categoryData, brandData, ...rest }) => {
  const categorySelection = categoryData.map(item => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const brandSelection = brandData.map(item => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const searchFields = [
    {
      type: 'input',
      name: 'title',
      label: '商品名称',
      inputProps: {
        placeholder: '请输入报告名称',
      },
    },
    {
      type: 'select',
      label: '品牌类型',
      name: 'report_tag_id',
      inputProps: {
        showSearch: true,
        placeholder: '请选择',
        optionFilterProp: 'children',
      },
      options: categorySelection,
    },
    {
      type: 'select',
      label: '接收单位',
      name: 'unit_id',
      inputProps: {
        showSearch: true,
        placeholder: '请选择',
        optionFilterProp: 'children',
      },
      options: brandSelection,
    },
    {
      label: '创建时间',
      type: 'range',
      name: 'publish_time',
      inputProps: {
        format: 'YYYY-MM-DD HH:mm',
        placeholder: ['开始时间', '结束时间'],
      },
    },
  ];
  const advancedSearchProps = {
    filter,
    searchFields,
    ...rest,
  };

  return <AdvancedSearch {...advancedSearchProps} />;
};

export default Search;
