import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';
export default class RegisterResult extends Component {
render() {
  const query = this.props.location.query;
  if(query!=null){
    console.log(query.email);
  }
  const title = <div className={styles.title}>您的账户：{query==null?'':query.email} 注册成功</div>;

  const actions = (
    <div className={styles.actions}>
      <Link to="/user/login"><Button size="large" type="primary">返回首页</Button></Link>
    </div>
  );
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={title}
      description="激活邮件已发送到您的邮箱中，邮件有效期为24小时，请登录邮箱激活帐户。"
      actions={actions}
      style={{ marginTop: 56 }}
    />
  )
}
}
