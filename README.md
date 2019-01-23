![](https://github.com/win-winFE/dms/blob/master/app/assets/assets/logo.png)

[![repo size](https://img.shields.io/github/repo-size/win-winFE/dms.svg)](https://github.com/win-winFE/dms)
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
- [ ] 使用Redis缓存数据（配合使用[dms-api](https://github.com/win-winFE/dms-api)）
- [ ] 使用CDN缓存数据

**针对需求方**

- [x] 使用表单编辑动态数据
- [x] 数据审核（配合使用[dms-fetch](https://github.com/win-winFE/dms-fetch)）

### FQA

**为什么数据库使用Mysql？而不用MongoDB等Json友好型存储引擎？**

在生产环境中，所有请求都会走缓存/CDN，对于用什么存储原始数据不是很重要，Mysql对于多数开发更加友好易用，且在后台配置数据时不需要过多地考虑性能问题。