import React, { PureComponent } from 'react';
import { Icon, Divider, Tooltip } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import {Link, routerRedux} from 'dva/router';

import ca from '../../utils/ca';
import styles from './index.less';
import { connect } from "dva/index";

@connect()
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  handleLogout = async () => {
    const res = await ca.get('/api/userLogout');
    if (!res) return;
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/user/login'));
  };

  render() {
    const {
      collapsed,
      isMobile,
      logo,
      currentUser,
    } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          欢迎 {currentUser.real_name}
          <Tooltip placement="bottom" title="退出登录">
            <a
              className={styles.action}
              onClick={this.handleLogout}
            >
              <Icon type="logout" />
            </a>
          </Tooltip>
        </div>
      </div>
    );
  }
}
