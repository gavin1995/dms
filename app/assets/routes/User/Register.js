import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Popover, Progress } from 'antd';
import styles from './Register.less';

import ca from '../../utils/ca';
import {reloadAuthorized} from "../../utils/Authorized";

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect()
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        const res = await ca.post('/api/userCreate', {
          username: values.username,
          password: values.password,
          employee_id: values.employee_id,
          real_name: values.real_name,
        });
        if (!res) return;
        reloadAuthorized();
        this.props.dispatch(routerRedux.push('/'))
      }
    });
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
        help: '请输入密码！',
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
        callback('error');
      } else {
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
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix } = this.state;
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入公司邮箱地址！',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！',
                },
              ],
            })(<Input size="large" placeholder="请输入公司邮箱地址" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入3~16位用户名',
                },
              ],
            })(<Input size="large" placeholder="请输入3~16位用户名" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('real_name', {
              rules: [
                {
                  required: true,
                  message: '请输入真实姓名',
                },
              ],
            })(<Input size="large" placeholder="请输入真实姓名" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('employee_id', {
              rules: [
                {
                  required: true,
                  message: '请输入工号',
                },
              ],
            })(<Input size="large" placeholder="请输入工号" />)}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
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
