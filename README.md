![](https://github.com/win-winFE/dms/blob/master/app/assets/assets/logo.png)


[![issue](https://img.shields.io/github/issues/win-winFE/dms.svg)](https://github.com/win-winFE/dms)
[![license](https://img.shields.io/github/license/win-winFE/dms.svg)](https://github.com/win-winFE/dms)

## DMS

**基于Json Schema的json动态数据管理平台**

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
- [ ] 使用CDN缓存数据

**针对需求方**

- [x] 使用表单编辑动态数据
- [x] 数据审核（配合使用[dms-fetch](https://github.com/win-winFE/dms-fetch)）

## 使用

### 安装
```bash
> git clone https://github.com/win-winFE/dms.git
> yarn
```

### 启动
```bash
> yarn dev
```

### FAQ

<details>
  <summary>为什么数据库使用Mysql？而不用MongoDB等Json友好型存储引擎？</summary>
  在生产环境中，所有请求都会走缓存/CDN。
  对于用什么存储原始数据不是很重要，Mysql对于多数开发更加友好易用，且在后台配置数据时不需要过多地考虑性能问题。
</details>

<p></p>

## 参与贡献

我非常欢迎你的贡献，你可以通过以下方式和我一起共建 :smiley:：

- 在你的公司或个人项目中使用`dms`。
- 通过 [Issue](https://github.com/win-winFE/dms/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](https://github.com/win-winFE/dms/pulls) 改进 `dms` 的代码。
