import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  Table,
  message
} from 'antd';
import JsonSchemaForm from "../../components/JsonSchema";

import fetch from '../../utils/fetch';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getParams } from '../../utils/url';
import styles from './Param.less';
import { toJson } from "../../utils/utils";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea, Search } = Input;

const paramsSchema = {
  title: "编辑参数值",
  description: "用于下拉菜单",
  type: "array",
  items: {
    type: "object",
    required: ["key", "value"],
    properties: {
      key: {
        type: "string",
        title: "下拉菜单提交值"
      },
      value: {
        type: "string",
        title: "下拉菜单项名称"
      }
    },
    message: {
      required: "必须完整填写表单的每一项",
    }
  }
};

@Form.create()
export default class Param extends PureComponent {
  state = {
    modalVisible: false,
    data: [],
    loading: false,
    appId: 0,
    modalParamsVisible: false,
    associateUrl: '',
    associateUrlStop: 1,
  };


  componentDidMount() {
    this.fetchParamList();
  }

  fetchParamList = async () => {
    this.setState({
      loading: true,
    });
    const params = getParams(this.props.location.search);
    this.setState({
      appId: params.app_id,
    });
    const res = await fetch('get', `/api/paramList?app_id=${params.app_id}`);
    if (!res) {
      // 请求失败
      return
    }
    this.setState({
      data: res,
      loading: false,
    })
  };

  showParamModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  hideParamModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  showParamsModal = async (param_id) => {
    const res = await fetch('get', `/api/paramInfo?param_id=${param_id}`);
    if (!res) {
      // 请求失败
      return
    }
    this.setState({
      modalParamsVisible: true,
      currentSelectedParamId: param_id,
      formDataJson: JSON.parse(res.value),
      associateUrl: res.associate_url,
      associateUrlStop: res.associate_url_stop,
    });
  };

  hideParamsModal = () => {
    this.setState({
      modalParamsVisible: false,
    });
  };

  handleCreateParamSubmit = async () => {
    this.setState({
      modalVisible: false,
    });
    await this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      const res = await fetch('post', '/api/paramCreate', {
        ...values,
        app_id: this.state.appId,
      });
      if (!res) {
        // 请求失败
        return
      }
      await this.fetchParamList();
      message.success('添加成功');
      this.props.form.resetFields();
    });
  };

  onParamsChange = (data) => {
    const { formData } = data;
    this.setState({
      formDataStr: toJson(formData),
      formDataJson: formData,
    })
  };

  submitParamsValue = async () => {
    this.setState({
      modalParamsVisible: false,
    });
    const { formDataJson, currentSelectedParamId } = this.state;
    const res = await fetch('post', '/api/paramEdit', {
      value: formDataJson,
      param_id: currentSelectedParamId,
      associate_url_stop: 1, // 未停用/已停用：0/1
    });
    if (!res) {
      // 请求失败
      return
    }
    message.success('参数编辑成功');
  };

  changeAssociateUrl = (e) => {
    this.setState({
      associateUrl: e.target.value,
    })
  };

  useAssociateUrl = async () => {
    this.setState({
      modalParamsVisible: false,
    });
    const { currentSelectedParamId, associateUrl } = this.state;
    const res = await fetch('post', '/api/paramEdit', {
      associate_url: associateUrl,
      param_id: currentSelectedParamId,
      associate_url_stop: 0, // 未停用/已停用：0/1
    });
    if (!res) {
      // 请求失败
      return
    }
    message.success('关联URL参数成功');
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {  modalVisible, data, loading, formDataJson, modalParamsVisible, associateUrl, associateUrlStop } = this.state;

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
        title: '参数展示标题',
        dataIndex: 'title',
        key: 'param_title',
      }, {
        title: '请求参数名',
        dataIndex: 'name',
        key: 'param_name',
      }, {
        title: '创建者',
        dataIndex: 'creator',
        key: 'param_creator',
      }, {
        title: '最后更新人',
        dataIndex: 'updater',
        key: 'param_updater',
      }, {
        title: '操作',
        key: 'param_operating',
        render: (text, record) => (
          <span className={styles.tableOperatingButton}>
            <Button type="primary" ghost onClick={() => this.showParamsModal(record.id)}>编辑参数</Button>
            {/*<Button type="primary" ghost>停用</Button>*/}
            {/*<Button type="danger" ghost>删除</Button>*/}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="Param管理">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="参数列表"
            >
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.showParamModal()}>
                    新建参数
                  </Button>
                  <Modal
                    title="新建参数"
                    visible={modalVisible}
                    onCancel={this.hideParamModal}
                    footer={null}
                  >
                    <Form onSubmit={this.handleCreateParamSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                      <FormItem {...formItemLayout} label="表单展示标题">
                        {getFieldDecorator('title', {
                          rules: [
                            {
                              required: true,
                              message: '请输入表单展示标题',
                            },
                          ],
                        })(<Input placeholder="参数标题，如：城市" />)}
                      </FormItem>
                      <FormItem {...formItemLayout} label="请求参数名（英文）">
                        {getFieldDecorator('name', {
                          rules: [
                            {
                              required: true,
                              message: '请输入请求参数名',
                            },
                          ],
                        })(<Input placeholder="请求参数名，如：city" />)}
                      </FormItem>
                      <FormItem {...submitFormLayout}>
                        <Button onClick={this.hideParamModal}>取消</Button>
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
        <Modal
          width={760}
          title={`编辑参数：${!associateUrlStop ? '已' : '未'}使用参数接口`}
          visible={modalParamsVisible}
          onCancel={this.hideParamsModal}
          footer={null}
        >
          <Row>
            <Col span={17}>
              <Input placeholder="关联参数接口地址" value={associateUrl} onChange={this.changeAssociateUrl}/>
            </Col>
            <Col span={7}>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.useAssociateUrl}>
                使用接口地址生成参数
              </Button>
            </Col>
            <Col span={24} style={{ marginTop: 20 }}>
              <JsonSchemaForm
                schema={paramsSchema}
                formData={formDataJson}
                onChange={this.onParamsChange}
                onSubmit={this.submitParamsValue}
                onError={() => console.log("errors")}
              />
            </Col>
          </Row>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
