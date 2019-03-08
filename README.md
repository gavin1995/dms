![](https://github.com/win-winFE/dms/blob/master/app/assets/assets/logo.png)


[![issue](https://img.shields.io/github/issues/win-winFE/dms.svg)](https://github.com/win-winFE/dms)
[![license](https://img.shields.io/github/license/win-winFE/dms.svg)](https://github.com/win-winFE/dms)

## DMS

**基于Json Schema/UI Schema的json动态数据管理平台**

**在线demo正在制作中，有兴趣的可以先star一下哦，很快就会有demo了**

### 使用场景

* 所有需要动态配置数据的场景理论上都可以使用
* 作为配置中心，区分不同环境、不同应用，产出不同配置

### 示例场景

* 页面所有配置相关的数据
* app启动图
* 动态配置js、css链接，用于页面动态化更新
* 动态配置版本号，每次用户进入APP判断是否是最新版，是否需要更新
* 网页banner模块：频繁更换banner图
* 推荐展示：配置推荐商品/品类的ID，服务端获取DMS的配置数据（ID），然后获取该ID相关的数据
* 长期静态数据：介绍、关于、说明、协议等

### FEATURE

* 支持所有基本表单类型
* 支持默认数据、逻辑判断、配置验证等
* 支持UI Schema，可以配置出颜色选择器、密码框、日期选择器、进度条等高级控件
* 模块化（组件化）数据管理
* 实时表单预览
* 实时数据预览/审核（配合[dms-api](https://github.com/win-winFE/dms-api)，同时支持服务端代理请求，及浏览器端请求的数据预览与审核）
* 友好的json编辑器
* 支持动态增加参数
* 参数本身可以为DMS生成的配置数据
* 支持第三方参数接口（key/value格式）
* 配合[dms-upload](https://github.com/win-winFE/dms-upload)可以快速将通过表单上传的文件传入CDN/云存储
* 符合实际场景的权限控制：开发只负责schema编写，需求方配置所有数据

### TODO

**针对开发者**

- [x] 应用管理
- [x] 模块管理
- [x] 应用参数管理
- [x] 权限管理
- [x] Json Schema编辑
- [x] UI Schema编辑
- [x] 动态更新表单
- [x] 表单数据测试
- [x] 使用Redis缓存数据（配合使用[dms-api](https://github.com/win-winFE/dms-api)）
- [x] 统一表单图片上传管理
- [x] 使用CDN缓存数据，目前已支持Azure CDN（配合使用[dms-upload](https://github.com/win-winFE/dms-upload)）
- [ ] 在线demo

**针对需求方**

- [x] 使用表单编辑动态数据
- [x] 数据审核（配合使用[dms-fetch](https://github.com/win-winFE/dms-fetch)）

## 使用

### 请先确保已经安装好：node.js8+、mysql、redis，并已开启相关服务

### 安装

```bash
> git clone https://github.com/win-winFE/dms.git
> yarn # 若没有yarn，请使用 npm install
```

### 执行初始化sql

* 使用mysql执行 `dms/database/dms.sql`
* 使用mysql执行初始化用户数据 `dms/database/init.sql` (执行后可以使用：root root1234 登录DMS，也可以通过注册页面直接注册)
* 修改项目中mysql/redis相关配置`dms/config/config.default.js`（mysql默认密码为：root1234）

### 启动

```bash
> yarn start # 若没有yarn，请使用 npm run dev
```

### 停止

```bash
> yarn stop # npm run stop
```

### 调试

```bash
> yarn dev # npm run dev 编译后请替换public里相关文件，并修改config/manifest.json
```

## 高级

### 配置应用参数

* 在参数列表新建参数
* 编辑参数：
    1. 可以使用返回结果为 `key value 形式的对象数组` 的api生成下拉列表，配置接口地址后，请选择【使用接口地址生成参数】
    2. 可以使用手动配置 `key value 形式的对象数组` ，点击+号手动添加下拉菜单项，最后选择【提交】

* 参数可以配合审核地址使用（审核地址里面使用大括号{}包装参数将自动解析，动态生成审核地址）


### DMS自定义文件上传（配合使用[dms-upload](https://github.com/win-winFE/dms-upload)）

```bash
# 有任何问题可以加最下面的QQ群
# dms-upload带有权限验证（该功能默认关闭，外网使用请打开相关注释）
# 需要先执行`dms-upload/database/dms-upload.sql`
# 执行`dms-upload/database/init.sql`后，即可通过root root1234用户授权（也可以使用/api/create创建）
# 修改项目中mysql/redis相关配置`dms-upload/config/config.default.js`（mysql默认密码为：root1234）
# 默认文件保存在/usr/local/services/cdn/dms目录，通过//127.0.0.1:5000/dms访问
# 修改保存路径及访问域名，请修改dms-upload/config/config.default.js: cdnDir、cdnPrefix
# 建议改写dms-upload与自己公司的CDN、云存储等结合，或者独立部署一台服务器，通过lsyncd做实时文件同步
> git clone https://github.com/win-winFE/dms-upload.git # 获取dms-upload项目
> yarn # npm install
> yarn start # npm run start
```

### 数据访问（配合使用[dms-api](https://github.com/win-winFE/dms-api)）

```bash
# 有任何问题可以加最下面的微信群
# 获取模块数据
# 通过dms平台的【运营配置】->【数据管理】->【模块列表】->【编辑模块数据】
# 获取到请求前缀与唯一标示，拼装在一起即可发起GET请求
> git clone https://github.com/win-winFE/dms-api.git # 获取dms-api项目
> yarn # npm install
> yarn start # npm run start
```

### 数据审核（配合使用[dms-fetch](https://github.com/win-winFE/dms-fetch)）

```bash
# 有任何问题可以加最下面的微信群
# 在需要用到DMS的项目里面执行
> yarn add dms-fetch # npm install --save dms-fetch
```

**在自己项目中使用`dms-api`获取数据示例**

```js
import { getDMSDataByServer, getDMSDataByCDN } from 'dms-fetch';

// nodejs/browser：使用Redis存储数据
const getData = async (req) => {
  const { search } = req; // 伪代码，获取到url的search部分传给getDMSDataByServer
  try {
    // 建议封装统一获取DMS数据方法，只需要替换params后面的参数即可
    // node.js
    const res = await getDMSDataByServer('http://127.0.0.1:7102/api/dmsGetData?params=/1/1', search);
    // browser
    // const res = await getDMSDataByServer('http://127.0.0.1:7102/api/dmsGetData?params=/1/1');
    if (res.success) {
      // 获取到数据
      return res.data;      
    }
    return false;
  } catch (e) {
    console.error('获取DMS数据失败');
  }
};

// nodejs/browser：使用CDN存储数据，请使用getDMSDataByCDN
// 需自己将数据生成成json传至CDN

```

**审核**

在DMS中配置【开发配置】->【模块管理】中配置【关联审核地址】

地址支持参数匹配，如：

```bash
# 配置模块是使用了city参数，则地址可以配为
https://your-app.com?_c={city} # 选择参数不同时，跳转的审核地址也会不一样
```

### FAQ

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

## 参与贡献

我非常欢迎你的贡献，你可以通过以下方式和我一起共建 :smiley:：

- 在你的公司或个人项目中使用`dms`。
- 通过 [Issue](https://github.com/win-winFE/dms/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://github.com/win-winFE/dms/pulls) 改进 `dms` 的代码。

### 说明

* 本项目出自[win-winFE团队](https://github.com/win-winFE)，如有任何疑问，请扫下面二维码加入我们的QQ群

<img src="https://github.com/win-winFE/dms/blob/master/qrcode.jpeg" width="240px" />
