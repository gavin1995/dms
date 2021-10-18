DMS正在进行发布依赖最大的一次更新，敬请期待...

<img src="https://github.com/gavin1995/dms/blob/master/app/assets/assets/logo.png" width="480px" />

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/use.gif)


[![issue](https://img.shields.io/github/issues/gavin1995/dms.svg)](https://github.com/gavin1995/dms)
[![license](https://img.shields.io/github/license/gavin1995/dms.svg)](https://github.com/gavin1995/dms)

## 动态数据管理神器-DMS

### 重构中，敬请期待...

### 介绍

#### 什么是DMS？

基于Json Schema/UI Schema`模块化`的Json动态数据管理平台。

#### 什么是Json Schema/UI Schema？

* 用于动态生成表单的Schema，参考 [Json Schema使用案例](https://mozilla-services.github.io/react-jsonschema-form/)
* [官方文档](https://json-schema.org/understanding-json-schema/index.html)

#### 使用场景有哪些？

无论前端、后端、移动端、运维，理论上所有需要动态配置数据的场景都可以使用。

针对前端、移动端：可以配置页面每个模块展示型数据，也可以配置各种版本号用于动态更新，各种功能开关、页面主题等。

针对后端：可以配置业务相关的ID，配置类目，城市列表，热门等。

针对运维：可以作为区分环境的配置中心等。

当然使用场景远不止这些......

#### 可以运用到生产环境吗？

当然可以，DMS存储的数据读写是完全分开的，目前支持通过Redis（使用redis获取数据方式请参考[注意](https://github.com/gavin1995/dms#%E6%B3%A8%E6%84%8F)）、CDN(推荐)两种获取数据方式。即使DMS自身服务器挂掉，也不会影响数据的读取。强烈推荐使用CDN的方式，这样稳定性和使用的CDN是一样的。

#### DMS应用、模块、参数介绍

* 应用：包含一个或多个模块，包含一个或多个参数
* 模块：配置数据的最小单位
* 参数：使模块根据不同参数配置不同数据（如：每个城市展示的频道页不一样）

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/tb.png)

#### DMS特性

* 实时表单预览；
* 模块化（组件化）数据管理；
* 支持表单数据逻辑判断、数据验证；
* Schema数据自动保存(默认关闭)，防止误操作及未知异常；
* 支持动态增加参数，参数本身也可以为DMS生成的配置数据；
* 配合[dms-upload](https://github.com/gavin1995/dms-upload)可以快速将通过表单上传的文件传入CDN/云存储
* 符合实际场景的权限控制：开发只负责schema编写，需求方配置所有数据；
* 支持Schema生成所有基本表单类型及高级控件，如：日期选择器、进度条、密码框、颜色选择器等；
* 实时数据预览/审核（配合[dms-fetch](https://github.com/gavin1995/dms-fetch)，同时支持服务端代理请求，及浏览器端请求的数据预览与审核）
* 支持anyOf
* 实时错误提示，错误提示支持中文
* 运营/产品权限区分
* 统一表单图片上传管理
* 应用、模块、参数、权限管理
* 使用Redis缓存数据（需配合使用：[dms-api](https://github.com/gavin1995/dms-api)）
* Json Schema/UI Schema在线编辑及生成表单预览
* 使用表单编辑动态数据及实时数据审核（配合使用[dms-fetch](https://github.com/gavin1995/dms-fetch)）
* 使用CDN缓存数据，目前已支持Azure CDN（配合使用[dms-upload](https://github.com/gavin1995/dms-upload)）


#### TODO

- [ ] 示例项目
- [ ] [阿里云Serverless](https://serverless.aliyun.com/)支持及数据二次加工

#### 需求池

- [ ] 样式优化
- [ ] [Formily](https://github.com/alibaba/formily)接入
- [ ] webassembly前端加密
- [ ] 在线Demo
- [ ] 初始化命令行交互配置

#### 最近三月完成功能

- [x] [阿里云OSS](https://cn.aliyun.com/product/oss)支持 - **2020.04.10**

### 快速开始

**请先确保已经安装好：nodejs8+、mysql、redis，并已开启相关服务**

**安装DMS**

```bash
> git clone https://github.com/gavin1995/dms.git
> yarn # 若没有yarn，请使用 npm install
```

**创建日志目录**

```bash
> mkdir /opt/logs/nodejs -p
```

**按需修改配置**

* 将项目根目录下的`.config.js`改名为`config.js`
* 对`config.js`按需进行配置修改

**执行初始化sql**

* 使用mysql执行 dms/database/dms.sql

**启动/停止/调试**

启动端口默认为：7101，需要修改请修改dms/package.json文件start部分的7101

```bash
> yarn start # 启动，若没有yarn，请使用 npm run start
> yarn stop # 停止， npm run stop
> yarn dev # 调试，npm run dev
```

**注册**

进入：`http://localhost:7101`

将自动跳转到登录页，选择【注册】，按要求填写相关数据，注册成功将自动跳转到【应用管理】页面

**新建示例应用**

点击【新建应用】，新建如下应用

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/create-app-modal.png)

**新建示例模块**

点击“淘宝首页”的【模块列表】，点击【新建模块】

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/create-module-modal.png)

**编写该模块Schema**

点击“首页banner”的【编辑Schema定义】，复制如下Schema到【Schema定义】中并【保存Schema】

```json
{
  "title": "示例",
  "description": "视频/图片展示配置示例",
  "type": "array",
  "minItems": 3,
  "items": {
    "type": "object",
    "properties": {
      "url": {
        "title": "跳转链接",
        "type": "string"
      },
      "imgs": {
        "title": "轮播图片",
        "type": "string",
        "format": "file"
      }
    } 
  }
}
```

**添加一个参数**

进入【参数列表】，添加如下参数

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/create-params.png)

【编辑参数】，【提交】如下参数

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/edit-params.png)

**编辑数据**

点击左侧菜单，进入【数据管理】，进入“淘宝首页”应用的【模块列表】，选择城市后点击【进入】，再选择“首页banner”的【编辑模块数据】，此时还不能上传图片、保存数据，需要启用[dms-upload](https://github.com/gavin1995/dms-upload)

**启动dms-upload**

```bash
> git clone https://github.com/gavin1995/dms-upload.git
> yarn # npm install
```

**执行初始化sql**

* 使用mysql执行 dms-upload/database/dms-upload.sql
* 使用mysql执行 dms-upload/database/init.sql（用于上传时的权限验证，默认：root root1234）
* 修改项目中mysql/redis相关配置dms/config/config.default.js（mysql默认密码为：root1234）

**配置dms-upload**

* 启动端口（默认7100）：dms-upload/package.json start部分，若修改端口。请修改 dms/app/util/constants.js dmsUploadAPI 中的请求地址前缀
* 数据库配置：dms-upload/config/config.defult.js
* CDN文件保存目录（默认/usr/local/services/cdn/dms）：dms-upload/config/config.defult.js cdnDir
* CDN文件访问地址前缀（默认//127.0.0.1:5000/dms）：dms-upload/config/config.defult.js cdnPrefix 

**新建CDN文件（图片、json数据）保存目录**

```bash
> mkdir /usr/local/services/cdn/dms/data -p # 若未使用默认cdnDir，请修改data前面部分
> mkdir /usr/local/services/cdn/dms/res -p # 若未使用默认cdnDir，请修改res前面部分
```

**启动dms-upload**

```bash
> yarn start # npm run start
```

**本地调试上传图片回显**

```bash
> cd /usr/local/services/cdn
> python -m SimpleHTTPServer 5000 # python3 请使用： python3 -m http.server 5000
```

**继续回到DMS平台编辑数据**

提交下列数据

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/edit-data.png)

#### 直接访问数据（用于非js使用场景）

**临时数据：提交后复制成功Toast中的链接，可以直接访问临时数据数据**

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/toast.png)

**正式数据：将临时数据审核为正式数据，也可以通过Toast中的链接直接访问正式数据**

![](https://github.com/gavin1995/dms/blob/master/app/public/assets/images/module-list.png)

#### 使用dms-fetch访问数据（用于js使用场景）

1.项目中安装dms-fetch（不建议，强依赖axios，说明见QA）

```bash
> yarn add dms-fetch # npm install dms-fetch --save
```

2.带参数使用示例（伪代码）

```js
import { getDMSDataByCDN } from 'dms-fetch';
import ...

// 复制编辑数据页面的唯一标示，下面是React应用配合使用DMS参数的示例
export default class extends React.Component {
    ...
    fetchData = async () => {
        const { city } = getParams(this.props.location.search);
        const dmsData = await getDMSDataByCDN(`/7/10/city/${city}`, this.props.location.search);
        this.setState({
            dmsData,
        });
    };
    ...
    render() {
       ...
    }
}
```

### 高级

#### 配置应用参数

* 在参数列表新建参数
* 编辑参数：
    1. 可以使用返回结果为 `key value 形式的对象数组` 的api生成下拉列表，配置接口地址后，请选择【使用接口地址生成参数】
    2. 可以使用手动配置 `key value 形式的对象数组` ，点击+号手动添加下拉菜单项，最后选择【提交】

* 参数可以配合审核地址使用（审核地址里面使用大括号{}包装参数将自动解析，动态生成审核地址）
* 使用DMS自身生成参数列表示例Schema（城市参数为例）：

    ```json
    {
      "title": "编辑城市值",
      "description": "用于城市选择下拉菜单",
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "object",
        "required": ["key", "value"],
        "properties": {
          "key": {
            "type": "string",
            "title": "下拉菜单提交值（如：chengdu）"
          },
          "value": {
            "type": "string",
            "title": "下拉菜单项名称（如：成都）"
          }
        },
        "message": {
          "required": "必须完整填写表单的每一项"
        }
      }
    }
    ```




#### DMS自定义文件上传（配合使用[dms-upload](https://github.com/gavin1995/dms-upload)）

```bash
# 有任何问题可以加最下面的QQ群
# dms-upload带有权限验证（该功能默认关闭，外网使用请打开相关注释）
# 需要先执行`dms-upload/database/dms-upload.sql`
# 执行`dms-upload/database/init.sql`后，即可通过root root1234用户授权（也可以使用/api/create创建）
# 修改项目中mysql/redis相关配置`dms-upload/config/config.default.js`（mysql默认密码为：root1234）
# 默认文件保存在/usr/local/services/cdn/dms目录，通过//127.0.0.1:5000/dms访问
# 修改保存路径及访问域名，请修改dms-upload/config/config.default.js: cdnDir、cdnPrefix
# 建议改写dms-upload与自己公司的CDN、云存储等结合，或者独立部署一台服务器，通过lsyncd做实时文件同步
> git clone https://github.com/gavin1995/dms-upload.git # 获取dms-upload项目
> yarn # npm install
> yarn start # npm run start
```

#### 数据访问（配合使用[dms-api](https://github.com/gavin1995/dms-api)）

```bash
# 有任何问题可以加最下面的微信群
# 获取模块数据
# 通过dms平台的【运营配置】->【数据管理】->【模块列表】->【编辑模块数据】
# 获取到请求前缀与唯一标示，拼装在一起即可发起GET请求
> git clone https://github.com/gavin1995/dms-api.git # 获取dms-api项目
> yarn # npm install
> yarn start # npm run start
```

#### 数据审核（配合使用[dms-fetch](https://github.com/gavin1995/dms-fetch)）

```bash
# 有任何问题可以加最下面的微信群
# 在需要用到DMS的项目里面执行
> yarn add dms-fetch # npm install --save dms-fetch
```

#### 审核

在DMS中配置【开发配置】->【模块管理】中配置【关联审核地址】

地址支持参数匹配，如：

```bash
# 配置模块是使用了city参数，则地址可以配为
https://your-app.com?_c={city} # 选择参数不同时，跳转的审核地址也会不一样
```

#### 调试

```bash
> yarn dev # npm run dev 编译后请替换public里相关文件，并修改config/manifest.json
```

### FAQ

<details>
  <summary>如何使用CDN？</summary>
    
  1. 直接利用nginx将相关目录映射出去
  
  2. 使用<a href="https://github.com/axkibe/lsyncd" target="_blank">lsyncd</a>将相关目录同步到线上相关CDN机器、云存储等（有些CDN需要强刷，目前DMS原生支持Azure CDN强刷）
</details>

<p></p>

<details>
  <summary>怎么使用Azure CDN？</summary>
  
  1. 打开dms-upload/app/controller/put以下注释
    
    const { refreshRes } = require('../util/azure'); // 10行左右
    await refreshRes(fileUrl); // 51行左右
    
  2.配置Azure CDN相关配置：dms-upload/app/util/azure.js

</details>

<p></p>

<details>
  <summary>如果遇到未知错误、意外操作怎么办？</summary>
  
  dms自身有Schema自动保存功能，重新进入页面（刷新）即可，也可以打开控制台，每次对Schema的修改都会打印到浏览器的控制台。
</details>

<p></p>

<details>
  <summary>为什么不建议直接使用dms-fetch？</summary>
  
  dms-fetch只是简单做了数据连接拼装的事情，建议直接将<a href="https://github.com/gavin1995/dms-fetch/blob/master/src/index.js" target="_blank">相关使用到的代码</a>写入自己项目，统一请求处理，统一错误处理。
</details>

<p></p>

<details>
  <summary>salt放在前端，如何做数据链接防盗？？</summary>
  可以使用我朋友的前端代码加密：
  <a href="https://github.com/qiaozi-tech/SecurityWorker" target="_blank">SecurityWorker</a>，独立Javascript VM + 二进制混淆，几乎是不可能做到代码反向的，也就看不到salt了。
</details>

<p></p>

<details>
  <summary>为什么数据库使用Mysql？而不用MongoDB等Json友好型存储引擎？</summary>
  在生产环境中，所有请求都会走缓存/CDN。
  
  对于用什么存储原始数据不是很重要，Mysql对于多数开发更加友好易用，且在后台配置数据时不需要过多地考虑性能问题。
</details>

<p></p>

<details>
  <summary>Schema与数据的存储为什么不直接用Mysql5.7.8的原生JSON类型？</summary>
  在生产环境中，使用到Mysql5.7.8+的公司应该是少数，考虑到大多数实际场景，所以使用TEXT类型存储。
  
  当然有需要的同学，可以直接将相关数据字段改为JSON。
</details>

<p></p>


### 注意

* 用Redis可能遇到的问题：针对用DMS应用量巨大的公司，会使redis集群占用内存飙高，随着业务不断的增加，该集群的稳定性要求会不断提高，如果集群挂掉，所有压力将使mysql承接，请提前做好相应的预防措施
* 不建议直接使用dms-fetch
* 若npm安装出现问题，请使用yarn
* 若超管需要访问非自己创建的应用，需要先给自己授权（防止误操作）
* 若dms不能使用 127.0.0.1:7100 访问dms-upload时，请修改dms/app/util/constants.js中的dmsUploadAPI

### 参与贡献

我非常欢迎你的贡献，你可以通过以下方式和我一起共建 :smiley:：

- 在你的公司或个人项目中使用`dms`。
- 通过 [Issue](https://github.com/gavin1995/dms/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://github.com/gavin1995/dms/pulls) 改进 `dms` 的代码（注意：提交前请先执行`yarn build`产出可直接start启动的代码）。
