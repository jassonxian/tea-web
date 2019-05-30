import React from 'react';
import { Table, Tag, Row, Col } from 'antd';
import { recoverSort } from '@/pages/_utils/utils';
import Operation from '@/components/Operation';
import styles from '../index.less';

const List = ({ list, loading, pagination, sort, handleChange, onRemove }) => {
  const dataSource = list.map(item => ({
    ...item,
    key: item.goods_id,
  }));
  const opertions = record => {
    const actions = [
      {
        text: '删除',
        confirmer: {
          title: '确定删除该报告吗？',
          placement: 'topRight',
          onConfirm: () => onRemove(record),
        },
      },
    ];

    return <Operation actions={actions} />;
  };
  const columns = [
    { title: '商品名称', dataIndex: 'goods_name', key: 'goods_name' },
    {
      title: '代理商名称',
      key: 'agent_name',
      dataIndex: 'agent_name',
    },
    {
      title: '商品价格',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      render: text => {
        return <Tag>¥{text}</Tag>;
      },
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
  const showExpanded = record => {
    return (
      <Row gutter={16}>
        <Col span={12}>
          <div className={styles.desc}>
            <h3>商品描述</h3>
            <p>{record.explain}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.desc}>
            <h3>展示图片</h3>
            <div className={styles.showImg}>
              {record.goods_picture.map(item => {
                return (
                  <img
                    key={item[0]}
                    src={`/api/goods/picture?goods_id=${record.goods_id}&filepath=${item[0]}`}
                    alt="暂无"
                  />
                );
              })}
            </div>
            <h3>订制图片</h3>
            <div className={styles.showImg}>
              {record.template_picture.map(item => {
                return (
                  <img
                    key={item[0]}
                    src={`/api/goods/picture?goods_id=${record.goods_id}&filepath=${item[0]}`}
                    alt="暂无"
                  />
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    );
  };
  return (
    <Table
      columns={recoverSort(columns, sort)}
      loading={loading}
      dataSource={dataSource}
      expandedRowRender={record => showExpanded(record)}
      pagination={pagination}
      onChange={onChange}
    />
  );
};

export default List;
