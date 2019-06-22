import React from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';

const Search = ({ filter, ...rest }) => {
  const searchFields = [
    {
      type: 'select',
      label: '订单状态',
      name: 'order_status',
      inputProps: {
        showSearch: true,
        placeholder: '请选择',
        optionFilterProp: 'children',
      },
      options: [
        {
          value: '0',
          label: '全部订单',
        },
        {
          value: '1',
          label: '待支付',
        },
        {
          value: '2',
          label: '待发货',
        },
        {
          value: '3',
          label: '已发货',
        },
        {
          value: '4',
          label: '已完成',
        },
      ],
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
