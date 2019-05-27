import React from 'react';
import Moment from 'moment';
import lodash from 'lodash';
import { Row, Col, Form, Input, Select, InputNumber, DatePicker, Button, Icon } from 'antd';
import { momentToString, stringToMoment } from '../_utils/timeTools';
import styles from './index.less';

const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

class AdvancedSearch extends React.Component {
  state = { expand: false };

  getInput = item => {
    const { type, inputProps } = item;
    switch (type) {
      case 'input':
        return <Input {...inputProps} />;
      case 'number':
        return <InputNumber {...inputProps} style={{ width: '100%' }} />;
      case 'select':
        return (
          <Select {...inputProps}>
            {item.options.map(option => (
              <Option
                value={Number.isNaN(option.value - 0) ? option.value : option.value.toString()}
                key={`select${option.value}`}
              >
                {option.label || option.value}
              </Option>
            ))}
          </Select>
        );
      case 'time':
        return <DatePicker {...inputProps} showTime style={{ width: '100%' }} />;
      case 'range':
        return (
          <RangePicker
            {...inputProps}
            showTime
            disabledDate={current => current && current.valueOf() > Date.now()}
            style={{ width: '100%' }}
          />
        );
      default:
        return <Input {...inputProps} />;
    }
  };

  getFields = () => {
    const {
      searchFields,
      form: { getFieldDecorator },
      filter,
    } = this.props;
    const { expand } = this.state;
    const count = expand ? searchFields.length : 2;
    const fields = [];
    searchFields.forEach((item, index) => {
      const { name, label, decoratorOptions, inputProps } = item;
      const newDecoratorOptions = {
        ...decoratorOptions,
        initialValue: this.switchValue(filter[name], inputProps && inputProps.format),
      };
      fields.push(
        <Col key={name} style={{ display: index < count ? 'block' : 'none' }} md={8} sm={24}>
          <Item label={label}>
            {getFieldDecorator(name, newDecoratorOptions)(this.getInput(item))}
          </Item>
        </Col>
      );
    });
    return fields;
  };

  getTimeFormat = key => {
    const { searchFields } = this.props;
    const item = searchFields.find(i => i.name === key);
    return item.inputProps.format;
  };

  switchValue = (value, style) => {
    const data = lodash.cloneDeep(value);
    if (!data) return undefined;
    if (data.includes(',')) {
      return data.split(',').map(item => this.switchValue(item, style));
    }
    return stringToMoment(data, style);
  };

  cleanSearchData = values => {
    const data = lodash.cloneDeep(values);
    Object.keys(data).forEach(key => {
      if (!data[key]) {
        delete data[key];
      }
      if (Moment.isMoment(data[key])) {
        data[key] = momentToString(data[key], this.getTimeFormat(key));
      }
      if (Array.isArray(data[key]) && Moment.isMoment(data[key][0])) {
        data[key] = momentToString(data[key], this.getTimeFormat(key));
      }
    });
    return data;
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleSearch = e => {
    const { form, onOk } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onOk(this.cleanSearchData(values));
      }
    });
  };

  handleReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset();
  };

  render() {
    const { searchFields } = this.props;
    const { expand } = this.state;
    const showMdSpan = (length = 0) => {
      if (length % 3 === 0 && expand) {
        return 24;
      }
      if (length % 3 === 1 && expand) {
        return 16;
      }
      return 8;
    };
    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch}>
          {searchFields.length === 1 || searchFields.length === 2 ? (
            <Row gutter={16}>
              {this.getFields()}
              <Col sm={{ span: 24 }} md={{ span: 8 }}>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重置
                </Button>
                {searchFields.length > 2 && (
                  <a style={{ marginLeft: 8, fontSize: 14 }} onClick={this.handleExpand}>
                    {expand ? '收起' : '展开'}
                    <Icon type={expand ? 'up' : 'down'} />
                  </a>
                )}
              </Col>
            </Row>
          ) : (
            <React.Fragment>
              <Row gutter={16}>
                {this.getFields()}
                <Col
                  sm={{ span: 24 }}
                  md={{ span: showMdSpan(searchFields.length) }}
                  style={searchFields.length > 2 && expand ? { textAlign: 'right' } : {}}
                >
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>
                  {searchFields.length > 2 && (
                    <a style={{ marginLeft: 8, fontSize: 14 }} onClick={this.handleExpand}>
                      {expand ? '收起' : '展开'}
                      <Icon type={expand ? 'up' : 'down'} />
                    </a>
                  )}
                </Col>
              </Row>
            </React.Fragment>
          )}
        </Form>
      </div>
    );
  }
}

export default Form.create()(AdvancedSearch);
