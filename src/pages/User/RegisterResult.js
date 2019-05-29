import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/agent">
      <Button size="large">
        <FormattedMessage id="app.register-result.back-login" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="app.register-result.msg"
          values={{ email: location.state ? location.state.account : '测试' }}
        />
      </div>
    }
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;
