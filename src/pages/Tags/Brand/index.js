import React from 'react';
import { connect } from 'dva';
import { Card, Button, Divider, Empty, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isActionsAllowable } from '@/utils/authority';
import Modal from './components/Modal';

const Tags = ({ dispatch, brand }) => {
  const { modalVisible, submitting, list } = brand;
  const onCreate = () => {
    dispatch({ type: 'brand/onCreate' });
  };
  const modalProps = {
    currentItem: {},
    modalType: 'create',
    visible: modalVisible,
    title: '新建标签',
    confirmLoading: submitting,
    onOk(values) {
      dispatch({
        type: 'brand/updateState',
        payload: {
          submitting: true,
        },
      });
      dispatch({
        type: `brand/create`,
        payload: values,
      });
    },
    onCancel() {
      dispatch({
        type: 'brand/updateState',
        payload: {
          modalVisible: false,
        },
      });
    },
  };
  const onClose = (e, id) => {
    e.preventDefault();
    dispatch({
      type: 'brand/remove',
      payload: {
        brand_id: id,
      },
    });
  };
  const showItem = () => {
    if (!list.length) {
      return <Empty />;
    }
    return list.map(item => {
      return (
        <Tag
          key={item.brand_id}
          closable={isActionsAllowable('admin')}
          onClose={e => onClose(e, item.brand_id)}
        >
          {item.brand_name}
        </Tag>
      );
    });
  };
  return (
    <PageHeaderWrapper title="标签管理">
      <Card bordered={false}>
        <div className="tableListPage">
          <div className="tableListOperator">
            <Button icon="plus" type="primary" onClick={onCreate}>
              新建
            </Button>
            <Divider>报告标签</Divider>
            {showItem()}
          </div>
        </div>
      </Card>
      <Modal {...modalProps} />
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ brand, loading }) => ({
  brand,
  fetching: loading.effects['brand/fetch'],
});

export default connect(mapStateToProps)(Tags);
