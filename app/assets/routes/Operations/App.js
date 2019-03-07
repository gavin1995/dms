import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Card,
  Modal,
  Table,
} from 'antd';

import ca from '../../utils/ca';
import { jsonToQueryString } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './App.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

@connect()
@Form.create()
export default class App extends PureComponent {
  state = {
    appCount: 0,
    appRows: [],
    appId: 0,
    appLoading: false,
    pageSize: 15,
    page: 1,
    name: '',
    currentSelectAuthAppId: 0, // 当前选中授权的AppID
    params: [],
    selectParamsModalVisible: false,
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
    if (!res) return;
    this.setState({
      appCount: res.count,
      appRows: res.rows,
      appLoading: false,
    })
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

  handleModuleRoute = async (app_id) => {
    const { dispatch } = this.props;
    // 参数列表
    const res = await ca.get(`/api/paramSelectList?app_id=${app_id}`);
    if (!res) return;
    if (!res.length) {
      dispatch(routerRedux.push(`/operations/module?app_id=${app_id}`));
      return;
    }
    this.setState({
      params: res,
      appId: app_id,
    });
    this.showSelectParamsModal();
  };

  showSelectParamsModal = () => {
    this.setState({
      selectParamsModalVisible: true,
    });
  };

  hideSelectParamsModal = () => {
    this.setState({
      selectParamsModalVisible: false,
    });
  };

  handleModuleRouteByParam = async () => {
    const { appId } = this.state;
    this.setState({
      selectParamsModalVisible: false,
    });
    await this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      const keys = Object.keys(values);
      const selectedValues = {};
      keys.forEach(key => {
        if (values[key] !== void 0) {
          selectedValues[key] = values[key]
        }
      });
      const paramQueryString = jsonToQueryString(selectedValues);
      const { dispatch } = this.props;
      if (paramQueryString) {
        dispatch(routerRedux.push(`/operations/module?app_id=${appId}&${paramQueryString}`));
        return;
      }
      dispatch(routerRedux.push(`/operations/module?app_id=${appId}`));
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const { appRows, appCount, appLoading, pageSize, page, users, authUsers, authModalVisible, params, selectParamsModalVisible } = this.state;

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
          visible={selectParamsModalVisible}
          onCancel={this.hideSelectParamsModal}
          footer={null}
        >
          <Row>
            <Col span={24}>
              <Form onSubmit={this.handleModuleRouteByParam} hideRequiredMark style={{ marginTop: 8 }}>
                {
                  !params.length || params === 'null' ?
                    null
                    :
                    (
                      params.map(item => {
                        if (item.value === 'null' || !item.value) {
                          return null;
                        }
                        return (
                          <FormItem style={{ marginBottom: 10 }} key={`param-${item.id}`}>
                            {getFieldDecorator(item.name)(
                              <Select
                                placeholder={`请选择${item.title}`}
                              >
                                {
                                  JSON.parse(item.value).map(i => (
                                    <Option value={i.key} key={`data-${i.key}-${i.value}`}>{i.value}</Option>
                                  ))
                                }
                              </Select>
                            )}
                          </FormItem>
                        );
                      })
                    )
                }
                <FormItem {...submitFormLayout} style={{ marginTop: 12 }}>
                  <Button onClick={this.hideSelectParamsModal}>取消</Button>
                  <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                    进入
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
