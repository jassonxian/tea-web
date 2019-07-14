import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

@connect(({ loading, global }) => ({
  global,
  submitting: loading.effects['global/password'],
}))
@Form.create()
class Password extends React.Component {
  state = {
    confirmDirty: false,
  };

  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'global/password',
          payload: values,
        });
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('密码输入不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const RegExp = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
    if (value && !RegExp.test(value)) {
      callback('格式有误！');
    }
    if (value && this.state.confirmDirty) {
      form.validateFields(['check_password'], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState(prevState => ({ confirmDirty: prevState.confirmDirty || !!value }));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { submitting } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} style={{ width: '50%' }}>
        <FormItem label="原始密码">
          {getFieldDecorator('old_password', {
            rules: [
              {
                required: true,
                message: '请填写原始密码！',
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem label="新密码">
          {getFieldDecorator('new_password', {
            rules: [
              {
                required: true,
                message: '请填写新密码！',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(
            <Input type="password" placeholder="请包含大小写字母，数字及特殊字符，如 !@#$%^&*?" />
          )}
        </FormItem>
        <FormItem label="确认密码">
          {getFieldDecorator('check_password', {
            rules: [
              {
                required: true,
                message: '请再次输入密码！',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" loading={submitting}>
            更新
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Password;
