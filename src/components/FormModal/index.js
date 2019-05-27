import React from 'react';
import { Modal, Form, Input, Cascader, Select, InputNumber, Radio } from 'antd';
import styles from './index.less';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;
const { Group } = Radio;

class FormModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      names: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { formFields, modalType } = nextProps;
    const fieldNames = [];
    formFields.forEach(item => {
      const { name } = item;
      if (modalType === 'update') {
        if (!item.editedIsHide) {
          fieldNames.push(name);
        }
      } else if (modalType === 'create') {
        if (!item.createdIsHide) {
          fieldNames.push(name);
        }
      } else {
        fieldNames.push(name);
      }
    });
    this.setState({
      names: fieldNames,
    });
  }

  render() {
    const {
      modalType,
      formFields,
      currentItem,
      onOk,
      form: { getFieldDecorator, validateFields },
      ...modalProps
    } = this.props;
    const { names } = this.state;
    const handleOk = () => {
      validateFields(names, (error, values) => {
        if (!error) {
          onOk(values);
        }
      });
    };

    const modalOpts = {
      ...modalProps,
      destroyOnClose: true,
      onOk: handleOk,
    };
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const getInput = item => {
      let type;
      switch (item.type) {
        case 'input':
          type = (
            <Input {...item.inputProps} disabled={modalType === 'update' && item.unallowedEditer} />
          );
          break;
        case 'areaCascader':
          type = (
            <Cascader
              {...item.inputProps}
              disabled={modalType === 'update' && item.unallowedEditer}
            />
          );
          break;
        case 'number':
          type = (
            <InputNumber
              {...item.inputProps}
              style={{ width: '100%' }}
              disabled={modalType === 'update' && item.unallowedEditer}
            />
          );
          break;
        case 'textarea':
          type = (
            <TextArea
              {...item.inputProps}
              disabled={modalType === 'update' && item.unallowedEditer}
            />
          );
          break;
        case 'select':
          type = (
            <Select {...item.inputProps} disabled={modalType === 'update' && item.unallowedEditer}>
              {item.options.map(v => (
                <Option value={v.value} key={v.value}>
                  {v.label || v.value}
                </Option>
              ))}
            </Select>
          );
          break;
        case 'radio':
          type = (
            <Group {...item.inputProps} disabled={modalType === 'update' && item.unallowedEditer}>
              {item.options.map(option => (
                <Radio value={option.value} key={option.value}>
                  {option.label || option.value}
                </Radio>
              ))}
            </Group>
          );
          break;
        default:
          break;
      }
      return type;
    };
    const getFields = () => {
      const fields = [];
      formFields.forEach(item => {
        if (item.editedIsHide && modalType === 'update') {
          fields.push(null);
        } else if (item.createdIsHide && modalType === 'create') {
          fields.push(null);
        } else {
          const { name, label, decoratorOptions } = item;
          const newDecoratorOptions = {
            ...decoratorOptions,
            initialValue: currentItem[name],
          };
          fields.push(
            <Item label={label} key={name} {...formItemLayout}>
              {getFieldDecorator(name, newDecoratorOptions)(getInput(item))}
            </Item>
          );
        }
      });
      return fields;
    };
    return (
      <Modal
        className={styles.standardListForm}
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        {...modalOpts}
      >
        <Form>{getFields()}</Form>
      </Modal>
    );
  }
}

export default Form.create()(FormModal);
