import React from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isActionsAllowable } from '../../utils/authority';
import { handleRefresh } from '@/pages/_utils/utils';
import Search from './components/Search';
import List from './components/List';
import Modal from './components/Modal';

const Agent = ({ location, dispatch, agent, fetching }) => {
  const {
    list,
    pagination,
    filter,
    sort,
    modalVisible,
    modalType,
    currentItem,
    roleSelection,
    unitSelection,
  } = agent;

  const searchProps = {
    unitSelection,
    filter,
    roleSelection,
    onOk(query) {
      handleRefresh(dispatch, location, { type: 'search', query });
    },
    onReset() {
      handleRefresh(dispatch, location, { type: 'search' });
    },
  };

  const listProps = {
    isActionsAllowable,
    list,
    loading: fetching,
    pagination,
    sort,
    handleChange(query) {
      handleRefresh(dispatch, location, { type: 'list', query });
    },
    activate(value) {
      dispatch({
        type: 'agent/activate',
        payload: value,
      });
    },
    remove(value) {
      dispatch({
        type: 'agent/remove',
        payload: value,
      });
    },
  };
  const modalProps = {
    type: modalType,
    visible: modalVisible,
    title: `${modalType === 'create' ? '新建代理商' : '编辑用户'}`,
    currentItem: modalType === 'create' ? {} : currentItem,
    onOk(values) {
      dispatch({
        type: `agent/${modalType}`,
        payload: values,
      });
    },
    onCancel() {
      dispatch({
        type: 'agent/updateState',
        payload: {
          modalVisible: false,
        },
      });
    },
  };
  const onCreate = () => {
    dispatch({ type: 'agent/onCreate' });
  };
  return (
    <PageHeaderWrapper title="代理商管理">
      <Card bordered={false}>
        <div className="tableListPage">
          <div className="tableSearchForm">
            <Search {...searchProps} />
          </div>
          <div className="tableListOperator">
            {isActionsAllowable('admin') && (
              <Button icon="plus" type="primary" onClick={onCreate}>
                新建
              </Button>
            )}
          </div>
          <List {...listProps} />
        </div>
      </Card>
      <Modal {...modalProps} />
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ agent, loading, global }) => ({
  agent,
  global,
  fetching: loading.effects['agent/fetch'],
});

export default connect(mapStateToProps)(Agent);
