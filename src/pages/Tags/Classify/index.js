import React from 'react';
import { connect } from 'dva';
import { Card, Button, Divider, Empty, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isActionsAllowable } from '@/utils/authority';
import Modal from './components/Modal';

const Tags = ({ dispatch, reporttags }) => {
  const { modalVisible, submitting, list } = reporttags;
  const onCreate = () => {
    dispatch({ type: 'reporttags/onCreate' });
  };
  const modalProps = {
    currentItem: {},
    modalType: 'create',
    visible: modalVisible,
    title: '新建标签',
    confirmLoading: submitting,
    onOk(values) {
      dispatch({
        type: 'reporttags/updateState',
        payload: {
          submitting: true,
        },
      });
      dispatch({
        type: `reporttags/create`,
        payload: values,
      });
    },
    onCancel() {
      dispatch({
        type: 'reporttags/updateState',
        payload: {
          modalVisible: false,
        },
      });
    },
  };
  const onClose = (e, id) => {
    e.preventDefault();
    dispatch({
      type: 'reporttags/remove',
      payload: {
        report_tag_id: id,
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
          key={item.id}
          closable={isActionsAllowable('remove-tag-report')}
          onClose={e => onClose(e, item.id)}
        >
          {item.name}
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

const mapStateToProps = ({ reporttags, loading, global }) => ({
  reporttags,
  global,
  fetching: loading.effects['reporttags/fetch'],
});

export default connect(mapStateToProps)(Tags);
