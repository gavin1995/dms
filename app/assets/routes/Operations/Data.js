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
import JsonSchemaForm from '../../components/JsonSchema';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/monokai';

import fetch from '../../utils/fetch';
import constants from '../../utils/constants';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getParams } from "../../utils/url";
import { toJson, fromJson } from "../../utils/utils";
import './Data.less';

@Form.create()
export default class Data extends PureComponent {
  state = {
    appId: 0,
    moduleId: 0,
    definition: '',
    paramsStr: '',
  };


  componentDidMount() {
    this.fetchModuleInfo();
    this.fetchTempData();
  }

  fetchTempData = async () => {

    const params = getParams(this.props.location.search);
    const paramsStr = `/${params.app_id}/${params.module_id}` + Object.keys(params).sort().map(key => {
      if (key === 'app_id' || key === 'module_id') {
        return '';
      }
      return `/${key}/${params[key]}`
    }).join('');
    const res = await fetch('get', `/api/dataGetTempData?module_id=${params.module_id}&params=${paramsStr}`);
    if (!res) {
      // 请求失败
      return
    }
    this.setState({
      paramsStr,
    });
    this.setState({
      formDataStr: res.data ? toJson(JSON.parse(res.data)) : undefined,
      formDataJson: res.data ? JSON.parse(res.data) : null,
    });
  };

  fetchModuleInfo = async () => {
    const params = getParams(this.props.location.search);
    this.setState({
      appId: params.app_id,
      moduleId: params.module_id,
    });
    const res = await fetch('get', `/api/moduleInfo?app_id=${params.app_id}&module_id=${params.module_id}`);
    if (!res) {
      // 请求失败
      return
    }
    const { definition, ui_schema } = res;
    if (definition) {
      const json = JSON.parse(definition);
      const uiSchema = ui_schema ? JSON.parse(ui_schema) : {};
      this.setState({
        uiSchema,
        formDefinition: json,
        definition: definition
      })
    }
  };

  onChange = (data) => {
    const { formData } = data;
    this.setState({
      formDataStr: toJson(formData),
      formDataJson: formData,
    })
  };

  submitTempData = async () => {
    const { formDataJson, paramsStr, moduleId } = this.state;
    const res = await fetch('post', '/api/dataEditTempData', {
      params: paramsStr,
      module_id: moduleId,
      data: formDataJson
    });
    if (!res) {
      // 请求失败
      return
    }
    await this.fetchTempData();
    message.success('添加数据成功，审核后同步');
  };

  render() {
    const { formDefinition, formDataStr, formDataJson, paramsStr, uiSchema } = this.state;
    return (
      <PageHeaderLayout title={`临时数据配置，请求前缀：${constants.commonApi}，唯一标示：${paramsStr}`}>
        <Row gutter={24}>
          <Col span={24}>
            {
              formDefinition && (formDataJson || formDataJson === null) ?
                <JsonSchemaForm
                  schema={formDefinition}
                  formData={formDataJson}
                  uiSchema={uiSchema}
                  onChange={this.onChange}
                  onSubmit={this.submitTempData}
                  onError={() => console.log("errors")}
                />
                :
                null
            }
          </Col>
          <Col style={{ marginTop: 20 }} span={24}>
            <h5>真实数据</h5>
            <AceEditor
              mode="json"
              theme="monokai"
              readOnly={true}
              value={formDataStr}
              name="real_data"
              editorProps={{$blockScrolling: true}}
              width={"100%"}
            />
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
