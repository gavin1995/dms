import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Card,
  Modal,
  Table,
  message
} from 'antd';

import ca from '../../utils/ca';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getParams } from '../../utils/url';
import styles from './Module.less';
import {routerRedux} from "dva/router";

const FormItem = Form.Item;

@connect()
@Form.create()
export default class Module extends PureComponent {
  state = {
    modalVisible: false,
    data: [],
    loading: false,
    appId: 0,
    associationUrlModalVisibleId: 0,
  };


  componentDidMount() {
    this.fetchModuleList();
  }

  fetchModuleList = async () => {
    this.setState({
      loading: true,
    });
    const params = getParams(this.props.location.search);
    this.setState({
      appId: params.app_id,
    });
    const res = await ca.get(`/api/moduleList?app_id=${params.app_id}`);
    if (!res) return;
    this.setState({
      data: res,
      loading: false,
    })
  };

  showModuleModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  hideModuleModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleCreateModuleSubmit = async () => {
    await this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      this.setState({
        modalVisible: false,
      });
      const res = await ca.post('/api/moduleCreate', {
        ...values,
        app_id: this.state.appId,
      });
      if (!res) return;
      await this.fetchModuleList();
      message.success('添加成功');
      this.props.form.resetFields();
    });
  };

  handleEditSchemaRoute = (module_id) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/development/schema?app_id=${this.state.appId}&module_id=${module_id}`));
  };

  handleAssociationUrl = async (module_id) => {
    this.setState({
      associationUrlModalVisibleId: 0,
    });
    if (!this.state[`associationUrl_${module_id}`]) {
      return;
    }
    const res = await ca.post('/api/moduleEditAssociationUrl', {
      module_id,
      association_url: this.state[`associationUrl_${module_id}`],
    });
    if (!res) return;
    message.success('更新成功');
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {  data, loading, associationUrlModalVisibleId } = this.state;

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

    const column = [
      {
        title: '模块名',
        dataIndex: 'name_cn',
        key: 'module_name_cn',
      }, {
        title: '英文名',
        dataIndex: 'name_en',
        key: 'module_name_en',
      }, {
        title: '创建者',
        dataIndex: 'creator',
        key: 'module_creator',
      }, {
        title: '最后更新人',
        dataIndex: 'updater',
        key: 'module_updater',
      }, {
        title: '操作',
        key: 'module_operating',
        render: (text, record) => (
          <span className={styles.tableOperatingButton}>
            <Button type="primary" ghost onClick={() => this.handleEditSchemaRoute(record.id)}>编辑Schema定义</Button>
            <Button type="primary" ghost onClick={() => this.setState({ associationUrlModalVisibleId: record.id })}>关联审核地址</Button>
            <Modal
              title="关联审核地址"
              visible={record.id === associationUrlModalVisibleId}
              onCancel={() => this.setState({ associationUrlModalVisibleId: 0 })}
              onOk={() => this.handleAssociationUrl(record.id)}
            >
              <Input placeholder="请输入审核（线上）地址" onChange={(e) => { this.setState({ [`associationUrl_${record.id}`]: e.target.value }) }} value={this.state[[`associationUrl_${record.id}`]] || record.association_url} />
            </Modal>
            {/* <Button type="primary" ghost>停用</Button>
            <Button type="danger" ghost>删除</Button> */}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="Module管理">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="模块列表"
            >
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.showModuleModal()}>
                    新建模块
                  </Button>
                  <Modal
                    title="新建模块"
                    visible={this.state.modalVisible}
                    onCancel={this.hideModuleModal}
                    footer={null}
                  >
                    <Form onSubmit={this.handleCreateModuleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                      <FormItem {...formItemLayout} label="模块中文名">
                        {getFieldDecorator('name_cn', {
                          rules: [
                            {
                              required: true,
                              message: '请输入3~24字符的模块中文名',
                            },
                          ],
                        })(<Input placeholder="请输入3~24字符的模块中文名" />)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="模块英文名">
                        {getFieldDecorator('name_en', {
                          rules: [
                            {
                              required: true,
                              message: '请输入模块英文名',
                            },
                          ],
                        })(<Input placeholder="请输入模块英文名" />)}
                      </FormItem>
                      <FormItem {...submitFormLayout}>
                        <Button onClick={this.hideModuleModal}>取消</Button>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit" loading={submitting}>
                          提交
                        </Button>
                      </FormItem>
                    </Form>
                  </Modal>
                </div>
                <Table
                  columns={column}
                  dataSource={data}
                  loading={loading}
                  pagination={false}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
