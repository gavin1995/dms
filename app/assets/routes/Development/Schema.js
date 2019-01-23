import React, { PureComponent } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  message
} from 'antd';
import JsonSchemaForm from "../../components/JsonSchema";
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/monokai';

import fetch from '../../utils/fetch';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './Schema.less';
import { getParams } from "../../utils/url";
import { toJson, fromJson, checkUISchema } from "../../utils/utils";
import './Schema.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea, Search } = Input;

@Form.create()
export default class Schema extends PureComponent {
  state = {
    appId: 0,
    moduleId: 0,
    definition: '',
    currentUISchema: '',
  };


  componentDidMount() {
    this.fetchModuleInfo();
  }

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
    // 转换为json字符串
    // const jsonStr = JSON.parse(definition);
    // 第一次fromJson 变成json字符串（格式化）
    definition ? this.onSchemaChange(definition) : this.onSchemaChange('');
    ui_schema ? this.onUISchemaChange(ui_schema) : this.onUISchemaChange('');
  };

  onSchemaChange = (val) => {
    try {
      const json = JSON.parse(val);
      // JsonSchemaForm 需要object，AceEditor需要json字符串
      this.setState({
        formDefinition: json,
        definition: val,
      })
    } catch (e) {
      this.setState({
        definition: val,
      })
    }
  };

  onUISchemaChange = (val) => {
    try {
      const json = JSON.parse(val);
      if (checkUISchema(json)) {
        // JsonSchemaForm 需要object，并且有该widget
        this.setState({
          uiSchema: json,
          currentUISchema: val,
        })
      }
      this.setState({
        currentUISchema: val,
      })
    } catch (e) {
      this.setState({
        currentUISchema: val,
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

  submitDefinition = async () => {
    try {
      const { definition, moduleId, currentUISchema } = this.state;
      // json验证
      const res = await fetch('post', '/api/moduleEditDefinition', {
        definition, // str
        module_id: moduleId,
        ui_schema: currentUISchema, // str
      });
      if (!res) {
        // 请求失败
        return
      }
      await this.fetchModuleInfo();
      message.success('保存成功');
    } catch (e) {
      message.error('保存失败，请检查json schema是否有误');
    }
  };

  render() {
    const { definition, formDefinition, formDataStr, formDataJson, uiSchema, currentUISchema } = this.state;
    return (
      <PageHeaderLayout title="Schema定义">
        <Row gutter={24}>
          <Col span={12}>
            <h5>Schema定义</h5>
            <AceEditor
              mode="json"
              theme="monokai"
              readOnly={false}
              value={definition}
              onChange={this.onSchemaChange}
              name="json_schema"
              editorProps={{$blockScrolling: true}}
              width={"100%"}
              height={"780px"}
            />
          </Col>
          <Col span={12}>
            <h5>UI Schema定义</h5>
            <AceEditor
              mode="json"
              theme="monokai"
              readOnly={false}
              value={currentUISchema}
              onChange={this.onUISchemaChange}
              name="ui_schema"
              editorProps={{$blockScrolling: true}}
              width={"100%"}
              height={"780px"}
            />
          </Col>
          <Col span={8} offset={8}>
            <button style={{ width: '100%', marginTop: 20 }} className="btn btn-info" onClick={this.submitDefinition}>保存Schema</button>
          </Col>
          <Col span={12}>
            {
              formDefinition ?
                <JsonSchemaForm
                  // liveValidate
                  // showErrorList={false}
                  // transformErrors={transformErrors}
                  isTest={true}
                  schema={formDefinition}
                  formData={formDataJson}
                  uiSchema={uiSchema}
                  onChange={this.onChange}
                  onSubmit={() => console.log("submitted")}
                  onError={() => console.log("errors")}
                />
                :
                null
            }
          </Col>
          <Col style={{ marginTop: 20 }} span={12}>
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
