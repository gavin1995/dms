import React, { Component } from 'react';
import { connect } from 'dva';
import {Link, routerRedux} from 'dva/router';
import { Checkbox, Alert } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import ca from "../../utils/ca";
import { reloadAuthorized } from '../../utils/Authorized';

const { UserName, Password, Submit } = Login;

@connect()
export default class LoginPage extends Component {
  state = {
    autoLogin: true,
  };

  handleSubmit = async (err, values) => {
    if (!err) {
      const res = await ca.post('/api/userLogin', {
        username: values.username,
        password: values.password,
      });
      if (!res) return;
      reloadAuthorized();
      this.props.dispatch(routerRedux.push('/'))
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
    const { login } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
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
          <Link to="/user/register">
            注册
          </Link>
          <Submit>登录</Submit>
        </Login>
      </div>
    );
  }
}
