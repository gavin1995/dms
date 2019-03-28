import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Card,
  Modal,
  Table,
  message,
  Transfer,
  notification
} from 'antd';

import ca from '../../utils/ca';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './App.less';

const FormItem = Form.Item;
const { TextArea, Search } = Input;

@connect()
@Form.create()
export default class App extends PureComponent {
  state = {
    appModalVisible: false,
    appCount: 0,
    appRows: [],
    appLoading: false,
    pageSize: 15,
    page: 1,
    name: '',
    authModalVisible: false,
    users: [], // 所有用户
    authUsers: [],
    currentSelectAuthAppId: 0, // 当前选中授权的AppID
  };


  componentDidMount() {
    this.fetchAppListByFilter();
  }

  fetchAppListByFilter = async () => {
    const { page, name, pageSize } = this.state;
    this.setState({
      appLoading: true,
    });
    const res = await ca.get(`/api/appList?page=${page}&name=${name}&page_size=${pageSize}`);
    if (!res) {
      // 请求失败
      return
    }
    this.setState({
      appCount: res.count,
      appRows: res.rows,
      appLoading: false,
    })
  };

  fetchAllUser = async () => {
    const res = await ca.get('/api/userAll');
    if (!res) return;
    this.setState({
      users: res,
    });
  };

  fetchAllAuthUser = async (app_id) => {
    const res = await ca.get(`/api/authList?app_id=${app_id}`);
    if (!res) return;
    const authUsers = res.map(item => item.user_id);
    this.setState({
      authUsers,
    });
  };

  showApplicationModal = () => {
    this.setState({
      appModalVisible: true,
    });
  };

  hideApplicationModal = () => {
    this.setState({
      appModalVisible: false,
    });
  };

  showAuthModalByAppId = async (id) => {
    try {
      this.setState({
        authModalVisible: true,
        currentSelectAuthAppId: id,
      });
      await this.fetchAllUser();
      await this.fetchAllAuthUser(id);
    } catch (e) {
      message.error('请求失败，请重试')
    }
  };

  hideAuthModal = () => {
    this.setState({
      authModalVisible: false,
    });
  };

  handleCreateAppSubmit = async () => {
    await this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      this.setState({
        appModalVisible: false,
      });
      const res = await ca.post('/api/appCreate', values);
      if (!res) return;
      await this.fetchAppListByFilter();
      message.success('添加成功');
      this.props.form.resetFields();
    });
  };

  handleSearch = async (val) => {
    await this.setState({
      name: val,
      page: 1,
    });
    await this.fetchAppListByFilter();
  };

  changePage = async (page) => {
    await this.setState({ page });
    await this.fetchAppListByFilter();
  };

  handleModuleRoute = async (id) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/development/module?app_id=${id}`));
  };

  handleParamRoute = async (id) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/development/param?app_id=${id}`));
  };

  handleTransferChange = (targetKeys) => {
    // targetKeys: user_id
    this.setState({
      authUsers: targetKeys,
    });
  };

  handleTransferSearch = () => {
    // 暂时不需要处理
  };

  submitAuthUsers = async () => {
    this.setState({
      authModalVisible: false,
    });
    const { authUsers, currentSelectAuthAppId } = this.state;
    if (!authUsers.length || !currentSelectAuthAppId) {
      return;
    }
    const res = await ca.post('/api/authEdit', {
      app_id: currentSelectAuthAppId,
      user_ids: authUsers,
    });
    if (!res) return;
    message.success('权限添加成功');
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { appRows, appCount, appLoading, pageSize, page, users, authUsers, authModalVisible } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const appColumns = [
      {
        title: '应用名',
        dataIndex: 'name_cn',
        key: 'app_name_cn',
      }, {
        title: '英文名',
        dataIndex: 'name_en',
        key: 'app_name_en',
      }, {
        title: '所有者',
        dataIndex: 'owner',
        key: 'app_owner',
      }, {
        title: '最后更新人',
        dataIndex: 'updater',
        key: 'app_updater',
      }, {
        title: '操作',
        key: 'app_operating',
        render: (text, record) => (
          <span className={styles.tableOperatingButton}>
            <Button type="primary" ghost onClick={() => this.handleModuleRoute(record.id)}>模块列表</Button>
            <Button type="primary" ghost onClick={() => this.handleParamRoute(record.id)}>参数列表</Button>
            <Button type="primary" ghost onClick={() => this.showAuthModalByAppId(record.id)}>授权</Button>
            <Button type="primary" ghost onClick={() => notification.info({ message: `${record.name_cn} 描述`, description: record.description })}>查看描述</Button>
            {/* <Button type="primary" ghost>编辑</Button> */}
            {/*<Button type="danger" ghost>删除</Button>*/}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="App管理">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="应用列表"
            >
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.showApplicationModal()}>
                    新建应用
                  </Button>
                  <Modal
                    title="新建应用"
                    visible={this.state.appModalVisible}
                    onCancel={this.hideApplicationModal}
                    footer={null}
                  >
                    <Form onSubmit={this.handleCreateAppSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                      <FormItem {...formItemLayout} label="应用中文名">
                        {getFieldDecorator('name_cn', {
                          rules: [
                            {
                              required: true,
                              message: '请输入3~24字符的应用中文名',
                            },
                          ],
                        })(<Input placeholder="请输入3~24字符的应用中文名" />)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="应用英文名">
                        {getFieldDecorator('name_en', {
                          rules: [
                            {
                              required: true,
                              message: '请输入应用英文名',
                            },
                          ],
                        })(<Input placeholder="请输入应用英文名" />)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="应用描述">
                        {getFieldDecorator('description', {
                          rules: [
                            {
                              required: true,
                              message: '请输入应用描述',
                            },
                          ],
                        })(
                          <TextArea
                            style={{ minHeight: 32 }}
                            placeholder="请输入应用描述"
                            rows={4}
                          />
                        )}
                      </FormItem>
                      <FormItem {...submitFormLayout}>
                        <Button onClick={this.hideApplicationModal}>取消</Button>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting}>
                          提交
                        </Button>
                      </FormItem>
                    </Form>
                  </Modal>
                  <Search
                    placeholder="请输入应用名"
                    onSearch={this.handleSearch}
                    enterButton
                    style={{ width: 400, marginLeft: 16 }}
                  />
                </div>
                <Table
                  columns={appColumns}
                  dataSource={appRows}
                  loading={appLoading}
                  pagination={{
                    pageSize,
                    current: page,
                    defaultCurrent: 1,
                    total: appCount,
                    onChange: this.changePage,
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Modal
          width={460}
          title="应用授权"
          visible={authModalVisible}
          onCancel={this.hideAuthModal}
          footer={null}
        >
          <Row>
            <Col span={24}>
              <Transfer
                dataSource={users}
                showSearch
                rowKey={record => record.user_id}
                targetKeys={authUsers}
                onChange={this.handleTransferChange}
                onSearch={this.handleTransferSearch}
                render={item => item.real_name}
              />
            </Col>
            <Col span={8} offset={8} style={{ marginTop: 20 }}>
              <Button onClick={this.hideAuthModal}>取消</Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.submitAuthUsers}>
                提交
              </Button>
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
