import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert } from 'antd';
import RenderAuthorized from '../../components/Authorized';
// import RenderAuthorized from 'ant-design-pro/lib/Authorized';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const user = 'user';
const Authorized = RenderAuthorized(user);
const noMatch = <Alert message="No permission." type="error" showIcon />;
const havePermission = () => {
  return false;
};
@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    type: 'account',
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSwitch = (type) => {
    this.setState({ type });
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          // this.props.dispatch({
          //   type: 'login/login',
          //   payload: {
          //     ...values,
          //     type: this.state.type,
          //   },
          // });
          alert('a')
        }
      }
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { count, type } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="账户密码登录" key="account">
              {
                login.status === 'error' &&
                login.type === 'account' &&
                login.submitting === false &&
                this.renderMessage('账户或密码错误')
              }
              <FormItem>
                {getFieldDecorator('userName', {
                  validateFirst: true,
                  rules: [{
                    required: true, message: '邮件地址不能为空'
                  },{
                    type:'email', message: '请输入正确的邮件地址',
                  },{
                    validator:(rule,value,callback)=>{
                      this.props.dispatch({
                        type: 'login/test',
                        payload: {
                          rule: rule,
                          value: value,
                          callback: callback,
                        },
                      })
                    }
                  }],
                  validateTrigger:'onBlur'
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="您的邮件地址"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: '请输入密码',
                  },{
                    type: 'string', message: '字符不合法',
                  }],
                  validateTrigger:'onBlur'
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="请输入密码"
                  />
                )}
              </FormItem>
            </TabPane>
            <TabPane tab="忘记密码" key="mobile">
              {
                login.status === 'error' &&
                login.type === 'mobile' &&
                login.submitting === false &&
                this.renderMessage('验证码错误')
              }
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: type === 'mobile', message: '请输入手机号！',
                  }, {
                    pattern: /^1\d{10}$/, message: '手机号格式错误！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                    placeholder="手机号"
                  />
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('captcha', {
                      rules: [{
                        required: type === 'mobile', message: '请输入验证码！',
                      }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="mail" className={styles.prefixIcon} />}
                        placeholder="验证码"
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </TabPane>
          </Tabs>
          <FormItem className={styles.additional}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={styles.autoLogin}>自动登录</Checkbox>
            )}
            <Link className={styles.forgot} to="/user/register">
              注册账户
            </Link>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
