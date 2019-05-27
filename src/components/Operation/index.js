import React from 'react';
import PropTypes from 'prop-types';
import uKey from 'unique-key';
import lodash from 'lodash';
import { Divider, Menu, Dropdown, Icon, Popconfirm } from 'antd';
import styles from './index.less';

const renderLinkItem = item => {
  if (item.confirmer) {
    const { title, okText, cancelText, ...rest } = item.confirmer;
    return (
      <Popconfirm
        title={title || '确定进行该操作吗？'}
        okText={okText || '确定'}
        cancelText={cancelText || '取消'}
        {...rest}
      >
        <a>{item.text}</a>
      </Popconfirm>
    );
  }
  return (
    <a onClick={item.onAction} className={item.disabled ? styles.disabled : null}>
      {item.text}
    </a>
  );
};

const renderMenuItem = item => {
  if (item.confirmer) {
    const { title, okText, cancelText, ...rest } = item.confirmer;
    return (
      <Menu.Item key={uKey()} disabled={item.disabled}>
        <Popconfirm
          title={title || '确定进行该操作吗？'}
          okText={okText || '确定'}
          cancelText={cancelText || '取消'}
          {...rest}
        >
          {item.text}
        </Popconfirm>
      </Menu.Item>
    );
  }
  return (
    <Menu.Item onClick={item.onAction} key={uKey()} disabled={item.disabled}>
      {item.text}
    </Menu.Item>
  );
};

const Operation = ({ actions }) => {
  if (actions.length === 0) {
    return '暂无';
  }

  // only one action
  if (actions.length === 1) {
    return renderLinkItem(actions[0]);
  }

  // two actions
  if (actions.length === 2) {
    return (
      <React.Fragment>
        {renderLinkItem(actions[0])}
        <Divider type="vertical" />
        {renderLinkItem(actions[1])}
      </React.Fragment>
    );
  }

  // find primary
  const primary = actions.find(item => item.primary) || actions[0];
  // filter more actions
  const more = actions.filter(item => !lodash.isEqual(item, primary));

  // generator drop down menu
  const menu = <Menu>{more.map(item => renderMenuItem(item))}</Menu>;

  const DropMenu = () => (
    <Dropdown overlay={menu} trigger={['click']}>
      <a>
        更多 <Icon type="down" />
      </a>
    </Dropdown>
  );

  return primary ? (
    <React.Fragment>
      {renderLinkItem(primary)}
      <Divider type="vertical" />
      <DropMenu />
    </React.Fragment>
  ) : (
    <DropMenu />
  );
};

Operation.propTypes = {
  actions: PropTypes.array.isRequired,
};

export default Operation;
