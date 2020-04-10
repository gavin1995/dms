'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  // 用户
  router.post('/api/userCreate', controller.user.create);
  router.post('/api/userLogin', controller.user.login);
  router.post('/api/userEdit', controller.user.edit);
  router.get('/api/userLogout', controller.user.logout);
  router.get('/api/userInfo', controller.user.info);
  router.get('/api/userAll', controller.user.all);

  // 应用
  router.post('/api/appCreate', controller.application.create);
  router.post('/api/appEdit', controller.application.edit);
  router.post('/api/appDelete', controller.application.delete);
  router.get('/api/appList', controller.application.list);

  // 参数
  router.post('/api/paramCreate', controller.param.create);
  router.post('/api/paramEdit', controller.param.edit);
  router.post('/api/paramDelete', controller.param.delete);
  router.get('/api/paramList', controller.param.list);
  router.get('/api/paramSelectList', controller.param.selectList);
  router.get('/api/paramInfo', controller.param.info);

  // 模块
  router.post('/api/moduleCreate', controller.module.create);
  router.post('/api/moduleEditDefinition', controller.module.editDefinition);
  router.post('/api/moduleEditAssociationUrl', controller.module.editAssociationUrl);
  router.post('/api/moduleDelete', controller.module.delete);
  router.get('/api/moduleList', controller.module.list);
  router.get('/api/moduleStatusList', controller.module.statusList);
  router.get('/api/moduleInfo', controller.module.info);

  // 权限
  router.post('/api/authCreate', controller.auth.create);
  router.post('/api/authEdit', controller.auth.edit);
  router.get('/api/authList', controller.auth.list);

  // 数据
  router.post('/api/dataEditTempData', controller.data.editTempData);
  router.post('/api/dataReviewTempData', controller.data.reviewTempData);
  router.get('/api/dataGetTempData', controller.data.getTempData);

  // 上传
  router.post('/api/putFileByPath', controller.put.putFileByPath);
};
