import React from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';

const Search = ({ filter, categoryData, brandData, ...rest }) => {
  const categorySelection = categoryData.map(item => {
    return {
      value: item.category_id,
      label: item.category_name,
    };
  });
  const brandSelection = brandData.map(item => {
    return {
      value: item.brand_id,
      label: item.brand_name,
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
      name: 'category_id',
      inputProps: {
        showSearch: true,
        placeholder: '请选择',
        optionFilterProp: 'children',
      },
      options: categorySelection,
    },
    {
      type: 'select',
      label: '商品类型',
      name: 'brand_id',
      inputProps: {
        showSearch: true,
        placeholder: '请选择',
        optionFilterProp: 'children',
      },
      options: brandSelection,
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
