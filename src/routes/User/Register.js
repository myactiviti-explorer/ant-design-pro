import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  okey: <div className={styles.success}>强度：非常强</div>,
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：低</div>,
};

const passwordProgressMap = {
  okey: 'success',
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(state => ({
  register: state.register,
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.register.status === 'ok') {
      this.props.dispatch(routerRedux.push('/user/register-result'));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
  };
  checkPasswordComplexity = (value) => {
    var complexity = 0;
    if(/([a-z])+/.test(value)){
      complexity++;
    }
    if(/([0-9])+/.test(value)){
      complexity++;
    }
    if(/([A-Z])+/.test(value)){
      complexity++;
    }
    if(/[^a-zA-Z0-9]+/.test(value)){
      complexity++;
    }
    return complexity;
  };
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    var rate = 0;
    rate = this.checkPasswordComplexity(value);
    if ( rate > 3) {
      return 'okey';
    }
    if ( rate == 3) {
      return 'ok';
    }
    if ( rate == 2) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix: this.state.prefix,
          },
        });
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        this.setState({
          help: '密码过短',
        });
        callback('error');
      }else if(this.checkPasswordComplexity(value) < 2){
        this.setState({
          help: '密码强度过低',
        });
        callback('error');
      }else if (value.length > 10) {
        this.setState({
          help: '密码过长',
        });
        callback('error');
      }else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    var rate = this.checkPasswordComplexity(value);
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={4}
          percent={rate * 25 > 100 ? 100 : rate * 25}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, register } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '邮件地址不能为空',
                },
                {
                  type: 'email',
                  message: '请输入正确的邮件地址',
                },{
                  validator:(rule,value,callback)=>{
                    this.props.dispatch({
                      type: 'register/checkEmail',
                      payload: {
                        rule: rule,
                        value: value,
                        callback: callback,
                      },
                    })
                  }
                }
              ],
              validateTrigger:'onBlur'
            })(<Input size="large" placeholder="您的邮件地址" />)}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请尽量使用数字、大小写字母和特殊字符组成的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                validateFirst: true,
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="6-10位密码，区分大小写"
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={register.submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}
