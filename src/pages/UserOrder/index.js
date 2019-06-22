import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const UserOrder = ({ location, match, children }) => {
  const handleTabChange = key => {
    switch (key) {
      case 'main':
        router.push(`${match.url}/main`);
        break;
      case 'sub':
        router.push(`${match.url}/sub`);
        break;
      default:
        break;
    }
  };

  const tabList = [
    {
      key: 'main',
      tab: '个人',
    },
    {
      key: 'sub',
      tab: '下级代理商',
    },
  ];
  return (
    <PageHeaderWrapper
      title="代理商订单管理"
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={location.pathname.replace(`${match.path}`, '')}
    >
      {children}
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ userorder }) => ({
  userorder,
});

export default connect(mapStateToProps)(UserOrder);
