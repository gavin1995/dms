import React, { PureComponent } from 'react';
import {
  Form,
  Row,
  Col,
  message,
  Card,
} from 'antd';
import JsonSchemaForm from '../../components/JsonSchemaForm';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/monokai';

import ca from '../../utils/ca';
import constants from '../../utils/constants';
import cfg from '../../../../config';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getParams } from "../../utils/url";
import { toJson, getParamsString, md5, fromJson } from "../../utils/utils";
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
    const paramsStr = getParamsString(params);
    const res = await ca.get(`/api/dataGetTempData?module_id=${params.module_id}&params=${paramsStr}`);
    if (!res) return;
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
    const res = await ca.get(`/api/moduleInfo?app_id=${params.app_id}&module_id=${params.module_id}`);
    if (!res) return;
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
    const res = await ca.post('/api/dataEditTempData', {
      params: paramsStr,
      module_id: moduleId,
      data: formDataJson
    });
    if (!res) return;
    await this.fetchTempData();
    message.success(`添加数据成功，审核后同步, cdn地址: ${res}`);
  };

  buildDes = () => (
    <div>
      临时数据: <a href={cfg.cdnPrefix + md5('y' + this.state.paramsStr) + '.json'} target="_blank">{cfg.cdnPrefix + md5('y' + this.state.paramsStr)}.json</a>
      <br/>
      正式数据: <a href={cfg.cdnPrefix + md5('n' + this.state.paramsStr) + '.json'} target="_blank">{cfg.cdnPrefix + md5('n' + this.state.paramsStr)}.json</a>
    </div>
  );

  render() {
    const { formDefinition, formDataStr, formDataJson, paramsStr, uiSchema } = this.state;
    // <PageHeaderLayout title="编辑临时数据">
    // <PageHeaderLayout title={`临时数据配置，请求前缀：${cfg.commonApi}，唯一标示：${paramsStr}`}>
    return (
      <PageHeaderLayout
        title={`编辑临时数据，当前数据唯一标示：${paramsStr}`}
        content={this.buildDes()}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title="编辑模块临时数据"
            >
              {
                formDefinition && (formDataJson || formDataJson === null) ?
                  <JsonSchemaForm
                    liveValidate
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
            </Card>
          </Col>
          <Col style={{ marginTop: 20 }} span={24}>
            <h5>真实数据(开发人员可以直接编辑)</h5>
            <AceEditor
              mode="json"
              theme="monokai"
              readOnly={false}
              value={formDataStr}
              name="real_data"
              editorProps={{$blockScrolling: true}}
              width={"100%"}
              onChange={(jsonData) => {
                this.setState({ formDataStr: jsonData });
                try {
                  const json = JSON.parse(jsonData);
                  this.setState({
                    formDataJson: json
                  })
                } catch (e) {
                  // 不做处理
                }
              }}
            />
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
