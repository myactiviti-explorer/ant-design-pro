import React, { Component } from 'react';
import queryString from 'query-string';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './GlobalSuccess.less';
import {SUCCESS} from '../../utils/Config'
export default class GlobalSuccess extends Component {
render() {
  const query = this.props.location.query || queryString.parse(this.props.location.search);
  const title = <div className={styles.title}>{query==null?'操作成功':SUCCESS[query.status]==null?'操作成功':SUCCESS[query.status]}</div>;

  const actions = (
    <div className={styles.actions}>
      <Link to="/user/login"><Button size="large" type="primary">返回首页</Button></Link>
    </div>
  );
  return (
    <Result
      className={styles.success}
      type="success"
      title={title}
      actions={actions}
      style={{ marginTop: 56 }}
    />
  )
}
}
