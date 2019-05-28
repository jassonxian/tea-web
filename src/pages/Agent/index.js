import React from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isActionsAllowable } from '../../utils/authority';
import { handleRefresh } from '@/pages/_utils/utils';
import Search from './components/Search';
import List from './components/List';
import Modal from './components/Modal';

const Users = ({ location, dispatch, users, fetching, global }) => {
  const {
    list,
    pagination,
    filter,
    sort,
    modalVisible,
    modalType,
    currentItem,
    roleType,
    roleSelection,
    customerSelection,
    unitSelection,
    submitting,
  } = users;
  const {
    currentUser: { role_group },
  } = global;

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
    role_group,
    list,
    loading: fetching,
    pagination,
    sort,
    handleChange(query) {
      handleRefresh(dispatch, location, { type: 'list', query });
    },
    onUpdate(item) {
      dispatch({
        type: 'users/onUpdate',
        payload: item,
      });
    },
    activate(value) {
      dispatch({
        type: 'users/activate',
        payload: value,
      });
    },
    remove(value) {
      dispatch({
        type: 'users/remove',
        payload: value,
      });
    },
    reset(value) {
      dispatch({
        type: 'users/reset',
        payload: value,
      });
    },
  };
  const modalProps = {
    type: modalType,
    visible: modalVisible,
    title: `${modalType === 'create' ? '新建用户' : '编辑用户'}`,
    currentItem: modalType === 'create' ? {} : currentItem,
    roleType,
    confirmLoading: submitting,
    roleSelection,
    customerSelection,
    unitSelection,
    onRoleChange(value) {
      dispatch({
        type: 'users/updateState',
        payload: { roleType: value },
      });
    },
    onOk(values) {
      dispatch({
        type: `users/${modalType}`,
        payload: values,
      });
    },
    onCancel() {
      dispatch({
        type: 'users/updateState',
        payload: {
          modalVisible: false,
        },
      });
    },
  };
  const onCreate = () => {
    dispatch({ type: 'users/onCreate' });
  };
  return (
    <PageHeaderWrapper title="用户管理">
      <Card bordered={false}>
        <div className="tableListPage">
          <div className="tableSearchForm">
            <Search {...searchProps} />
          </div>
          <div className="tableListOperator">
            {isActionsAllowable('create-user') && (
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

const mapStateToProps = ({ users, loading, global }) => ({
  users,
  global,
  fetching: loading.effects['users/fetch'],
});

export default connect(mapStateToProps)(Users);
