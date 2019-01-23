import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    autoLogin: true,
  };

  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        data: {
          ...values,
        },
      });
    }
  };

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = (content) => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          {login.status === 'error' &&
          !login.submitting &&
          this.renderMessage('账户或密码错误')}
          <UserName name="username" placeholder="账户" />
          <Password name="password" placeholder="密码" />
          <div>
            <Checkbox
              checked={this.state.autoLogin}
              onChange={this.changeAutoLogin}
              style={{ float: 'right' }}
            >
              自动登录
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
