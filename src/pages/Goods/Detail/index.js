import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Upload, Divider, Col, Row, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import { handleRefresh } from '@/pages/_utils/utils';
import List from './components/List';
import circularLogo from '@/assets/pages/circular.png';

const { Description } = DescriptionList;

const FlawDetail = ({ reportdetail, dispatch, location, fetching }) => {
  const { item, list, pagination, sort, showList } = reportdetail;
  const { report_path = [] } = item;
  const fileLists = () => {
    const fileList = [];
    for (let i = 0; i < report_path.length; i += 1) {
      fileList.push({
        uid: i,
        name: report_path[i][1],
        url: `/api/report/download/attachment?report_id=${item.report_id}&file_path=${
          report_path[i][0]
        }`,
        filePath: report_path[i],
      });
    }
    return fileList;
  };
  const downloadProps = {
    action: '/',
    fileList: fileLists(),
    showUploadList: {
      showRemoveIcon: false,
    },
  };
  const listProps = {
    list,
    loading: fetching,
    pagination,
    sort,
    handleChange(query) {
      handleRefresh(dispatch, location, { type: 'list', query });
    },
  };
  const showUnitOfState = time => {
    if (time) {
      return (
        <Fragment>
          <Description term="接收时间">{time}</Description>
          <Description term="报告状态">
            <Tag color="#108ee9">已接收</Tag>
          </Description>
        </Fragment>
      );
    }
    return (
      <Description term="报告状态">
        <Tag color="#f50">未接收</Tag>
      </Description>
    );
  };
  return (
    <PageHeaderWrapper
      title={`电子报告名称：${item.title || '暂无'}`}
      logo={<img alt="" src={circularLogo} />}
    >
      <Card title="电子报告详情" style={{ marginBottom: '24px' }}>
        <DescriptionList size="small" col="1">
          <Description term="编制单位">{item.issuing_name || '——'}</Description>
          <Description term="报告类型">{item.report_tag_name || '——'}</Description>
          {!showList ? showUnitOfState(item.confirm_time) : null}
          <Description term="报告概述">{item.report_content || '——'}</Description>
        </DescriptionList>
        {fileLists().length ? (
          <Fragment>
            <Divider orientation="left">报告附件</Divider>
            <Row>
              <Col span={12}>
                <Upload {...downloadProps} />
              </Col>
            </Row>
          </Fragment>
        ) : null}
      </Card>
      {showList ? (
        <Card title="单位处理情况" style={{ marginBottom: '24px' }}>
          <List {...listProps} />
        </Card>
      ) : null}
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ reportdetail, loading }) => ({
  reportdetail,
  fetching: loading.effects['reportdetail/fetch'],
});

export default connect(mapStateToProps)(FlawDetail);
