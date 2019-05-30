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
} from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { momentToString } from '@/components/_utils/timeTools';
import { EDITOR_RULES } from './const';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const fieldLabels = {
  title: '报告名称',
  unit_ids: '接收单位',
  report_tag_id: '报告类型',
  report_content: '报告概述',
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
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
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

  handleChange = ({ fileList }) => this.setState({ fileList });
  // *********

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  handleOnChange = ({ file, fileList }) => {
    if (file.status === 'error') {
      notification.error({
        message: (file.response && file.response.error && file.response.error.msg) || '未知错误',
      });
    }
    return fileList.map(item => ({
      status: item.status,
      name: item.name,
      uid: item.uid,
      url: item.url || null,
      filePath: item.response && item.response.data ? item.response.data[0] : item.filePath,
    }));
  };

  render() {
    const { form, dispatch, submitting, creategoods } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { item = {}, categoryData, brandData } = creategoods;
    const { previewVisible, previewImage, fileList } = this.state;

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
          modifiedValues.report_path = values.report_path
            .map(file => {
              return [file.filePath, file.name];
            })
            .filter(file => file[0] !== undefined);
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
    const uploadProps = {
      action: '/api/report/upload/attachment',
      beforeUpload(file) {
        return new Promise((resolve, reject) => {
          const type = [
            'txt',
            'doc',
            'docx',
            'xlsx',
            'xls',
            'ppt',
            'pptx',
            'zip',
            'tar',
            'gz',
            'pdf',
          ];
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
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.title}>
                  {getFieldDecorator('title', {
                    initialValue: item.title,
                    rules: EDITOR_RULES.title,
                  })(<Input placeholder="请输入商品名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.unit_ids}>
                  {getFieldDecorator('unit_ids', {
                    initialValue: item.unit_ids,
                    rules: EDITOR_RULES.unit_ids,
                  })(
                    <Select mode="multiple" placeholder="请选择商品品牌">
                      {brandData.map(v => (
                        <Option key={v.id} value={v.id}>
                          {v.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.unit_ids}>
                  {getFieldDecorator('unit_ids', {
                    initialValue: item.unit_ids,
                    rules: EDITOR_RULES.unit_ids,
                  })(
                    <Select mode="multiple" placeholder="请选择商品类别">
                      {categoryData.map(v => (
                        <Option key={v.id} value={v.id}>
                          {v.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.report_tag_id}>
                  {getFieldDecorator('report_tag_id', {
                    initialValue: item.report_tag_id ? item.report_tag_id - 0 : item.report_tag_id,
                    rules: EDITOR_RULES.report_tag_id,
                  })(
                    <Select placeholder="请选择报告类型">
                      {categoryData.map(vul => (
                        <Option key={vul.id} value={vul.id}>
                          {vul.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={fieldLabels.report_content}>
                  {getFieldDecorator('report_content', {
                    initialValue: item.report_content,
                    rules: EDITOR_RULES.report_content,
                  })(<TextArea rows={8} placeholder="请输入报告描述信息" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Form>
          <Card title="附件上传">
            <Row>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('report_path', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.handleOnChange,
                    initialValue: item.report_path || [],
                  })(
                    <Upload {...uploadProps}>
                      <Button>
                        <Icon type="upload" /> 上传文件
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <div className="clearfix">
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
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
