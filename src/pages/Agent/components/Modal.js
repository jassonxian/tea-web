import React from 'react';
import { Modal, Form, Input, Tooltip } from 'antd';
import { filterEmpty } from '@/utils/utils';
import { USER_RULES, formItemLayout } from './const';

const { Item } = Form;

const UserModal = ({
  type,
  currentItem,
  onOk,
  form: { getFieldDecorator, validateFields },
  ...rest
}) => {
  const handleOk = () => {
    const fields = ['username', 'agent_name', 'phone', 'password'];
    validateFields(fields, (error, values) => {
      if (!error) {
        const filtered = filterEmpty(values);
        onOk(filtered);
      }
    });
  };

  const modalOpts = {
    ...rest,
    destroyOnClose: true,
    style: { top: 40 },
    onOk: handleOk,
  };

  return (
    <Modal {...modalOpts} style={{ width: 600 }}>
      <Form layout="horizontal">
        <Item {...formItemLayout} label="代理商名称">
          {getFieldDecorator('agent_name', {
            initialValue: currentItem.agent_name,
            rules: USER_RULES.username,
          })(<Input placeholder="请输入代理商名称" />)}
        </Item>
        <Item {...formItemLayout} label="用户名">
          {getFieldDecorator('username', {
            initialValue: currentItem.username,
            rules: USER_RULES.username,
          })(<Input placeholder="请输入用户名" />)}
        </Item>
        <Item {...formItemLayout} label="密码">
          <Tooltip
            trigger={['focus']}
            title="请包含大小写字母，数字及特殊字符，如 !@#$%^&*?"
            placement="topLeft"
          >
            {getFieldDecorator('password', {
              rules: USER_RULES.password,
            })(<Input type="password" placeholder="请输入密码" />)}
          </Tooltip>
        </Item>
        <Item {...formItemLayout} label="手机">
          {getFieldDecorator('phone', {
            initialValue: currentItem.phone,
            rules: USER_RULES.phone,
          })(<Input placeholder="请输入手机号码" />)}
        </Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(UserModal);
