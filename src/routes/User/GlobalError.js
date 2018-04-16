import React, { Component } from 'react';
import queryString from 'query-string';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './GlobalError.less';
import {ERROR} from '../../utils/Config'
export default class GlobalError extends Component {
render() {
  const query = this.props.location.query || queryString.parse(this.props.location.search);
  const title = <div className={styles.title}>{query==null?'操作失败':ERROR[query.status]==null?'操作失败':ERROR[query.status]}</div>;

  const actions = (
    <div className={styles.actions}>
      <Link to="/user/login"><Button size="large" type="primary">返回首页</Button></Link>
    </div>
  );
  return (
    <Result
      className={styles.error}
      type="error"
      title={title}
      actions={actions}
      style={{ marginTop: 56 }}
    />
  )
}
}
