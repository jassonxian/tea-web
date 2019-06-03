import React from 'react';
import { connect } from 'dva';
import Moment from 'moment/moment';
import lodash from 'lodash';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
  Upload,
  notification,
  Modal,
  Divider,
  InputNumber,
} from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { momentToString } from '@/components/_utils/timeTools';
import { isActionsAllowable } from '@/utils/authority';
import EDITOR_RULES from './const';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const fieldLabels = {
  agent_id: '代理商',
  goods_name: '商品名称',
  category_id: '商品类别',
  brand_id: '商品品牌',
  count: '商品总数',
  freight: '邮费',
  price: '商品价格',
  explain: '商品概述',
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Index extends React.Component {
  state = {
    width: '100%',
    previewVisible: false,
    previewImage: '',
    fileListGoods: [],
    fileListTemplate: [],
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  // 上传图片

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChangeGoods = ({ fileList }) => this.setState({ fileListGoods: fileList });

  handleChangeTemplate = ({ fileList }) => this.setState({ fileListTemplate: fileList });

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { form, dispatch, submitting, creategoods } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { item = {}, categoryData, brandData, agentSelection } = creategoods;
    const { previewVisible, previewImage, fileListGoods, fileListTemplate } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const cleanSearchData = values => {
      const data = lodash.cloneDeep(values);
      Object.keys(data).forEach(key => {
        if (!data[key]) {
          delete data[key];
        }
        if (data[key] instanceof Moment) {
          data[key] = momentToString(data[key], 'YYYY-MM-DD HH:mm');
        }
        if (Array.isArray(data[key]) && data[key][0] instanceof Moment) {
          data[key] = momentToString(data[key], 'YYYY-MM-DD HH:mm');
        }
      });
      return data;
    };
    const validate = () => {
      this.props.form.setFieldsValue({
        vul_detail: this.state.wangEditorContent,
      });
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          const modifiedValues = lodash.cloneDeep(values);
          modifiedValues.goods_picture = modifiedValues.goods_picture.fileList.map(file => {
            return file.response.data;
          });
          modifiedValues.template_picture = modifiedValues.template_picture.fileList.map(file => {
            return file.response.data;
          });
          dispatch({
            type: 'creategoods/create',
            payload: cleanSearchData(modifiedValues),
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const uploadPropsGoods = {
      action: '/api/goods/upload/attachment',
      listType: 'picture-card',
      onPreview: this.handlePreview,
      fileList: fileListGoods,
      onChange: this.handleChangeGoods,
      beforeUpload(file) {
        return new Promise((resolve, reject) => {
          const type = ['jpg', 'jpeg', 'png'];
          if (file.size / 1024 >= 20480) {
            notification.error({
              message: '文件过大',
              description: '请上传小于20MB的文件',
            });
            reject(file);
          } else if (!type.includes(file.name.split('.').pop())) {
            notification.error({
              message: '文件格式有误',
              description: '请上传正确格式的文件',
            });
            reject(file);
          } else {
            resolve(file);
          }
        });
      },
    };
    const uploadPropsTemplate = {
      action: '/api/goods/upload/attachment',
      listType: 'picture-card',
      onPreview: this.handlePreview,
      fileList: fileListTemplate,
      onChange: this.handleChangeTemplate,
      beforeUpload(file) {
        return new Promise((resolve, reject) => {
          const type = ['jpg', 'jpeg', 'png'];
          if (file.size / 1024 >= 20480) {
            notification.error({
              message: '文件过大',
              description: '请上传小于20MB的文件',
            });
            reject(file);
          } else if (!type.includes(file.name.split('.').pop())) {
            notification.error({
              message: '文件格式有误',
              description: '请上传正确格式的文件',
            });
            reject(file);
          } else {
            resolve(file);
          }
        });
      },
    };
    return (
      <PageHeaderWrapper title="新建电子报告" wrapperClassName={styles.advancedForm}>
        <Card title="基础信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            {isActionsAllowable('admin') ? (
              <Row gutter={16}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.agent_id}>
                    {getFieldDecorator('agent_id', {
                      initialValue: item.agent_id,
                      rules: EDITOR_RULES.agent_id,
                    })(
                      <Select placeholder="请选择代理商">
                        {agentSelection.map(v => (
                          <Option key={v.agent_id} value={v.agent_id}>
                            {v.agent_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <Row gutter={16}>
              <Col lg={8} md={8} sm={24}>
                <Form.Item label={fieldLabels.goods_name}>
                  {getFieldDecorator('goods_name', {
                    initialValue: item.goods_name,
                    rules: EDITOR_RULES.goods_name,
                  })(<Input placeholder="请输入商品名称" />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={24}>
                <Form.Item label={fieldLabels.category_id}>
                  {getFieldDecorator('category_id', {
                    initialValue: item.category_id,
                    rules: EDITOR_RULES.category_id,
                  })(
                    <Select placeholder="请选择商品类别">
                      {categoryData.map(v => (
                        <Option key={v.category_id} value={v.category_id}>
                          {v.category_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={24}>
                <Form.Item label={fieldLabels.brand_id}>
                  {getFieldDecorator('brand_id', {
                    initialValue: item.brand_id,
                    rules: EDITOR_RULES.brand_id,
                  })(
                    <Select placeholder="请选择商品品牌">
                      {brandData.map(v => (
                        <Option key={v.brand_id} value={v.brand_id}>
                          {v.brand_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={8} sm={24}>
                <Form.Item label={fieldLabels.count}>
                  {getFieldDecorator('count', {
                    initialValue: item.count || 0,
                    rules: EDITOR_RULES.count,
                  })(<InputNumber min={0} placeholder="商品总数" />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={24}>
                <Form.Item label={fieldLabels.freight}>
                  {getFieldDecorator('freight', {
                    initialValue: item.freight || 0,
                    rules: EDITOR_RULES.freight,
                  })(
                    <InputNumber
                      min={0}
                      placeholder="商品邮费"
                      formatter={value => `¥${value}`}
                      parser={value => value.replace('¥', '')}
                      // formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={8} sm={24}>
                <Form.Item label={fieldLabels.price}>
                  {getFieldDecorator('price', {
                    initialValue: item.price || 0,
                    rules: EDITOR_RULES.price,
                  })(
                    <InputNumber
                      min={0}
                      placeholder="商品价格"
                      formatter={value => `¥${value}`}
                      parser={value => value.replace('¥', '')}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.explain}>
                  {getFieldDecorator('explain', {
                    initialValue: item.explain,
                    rules: EDITOR_RULES.explain,
                  })(<TextArea rows={8} placeholder="请输入商品描述信息" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Form>
          <Card title="附件上传">
            <Row>
              <Col span={24}>
                <Divider orientation="left">Left Text</Divider>
                <div className="clearfix">
                  <Form.Item>
                    {getFieldDecorator('goods_picture', {
                      initialValue: item.goods_picture || [],
                      rules: EDITOR_RULES.goods_picture,
                    })(
                      <Upload {...uploadPropsGoods}>
                        {fileListGoods.length >= 1 ? null : uploadButton}
                      </Upload>
                    )}
                  </Form.Item>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
                <Divider orientation="left">Left Text</Divider>
                <Form.Item>
                  {getFieldDecorator('template_picture', {
                    initialValue: item.template_picture || [],
                    rules: EDITOR_RULES.template_picture,
                  })(
                    <Upload {...uploadPropsTemplate}>
                      {fileListTemplate.length >= 1 ? null : uploadButton}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ creategoods, loading }) => ({
  creategoods,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Index));
