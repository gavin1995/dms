'use strict';

const Controller = require('egg').Controller;
const Joi = require('joi');
const _ = require('lodash');

const response = require('../util/response');

class ModuleController extends Controller {
  async create() {
    const { ctx } = this;
    const { app_id, name_cn, name_en } = ctx.request.body;
    const { userId } = ctx.base;
    // eslint-disable-next-line
    if (Joi.validate(name_cn, Joi.string().replace(' ', '').min(3).max(24).required()).error) {
      ctx.body = response.simpleError('模块中文名为3~24个字符');
      return;
    }
    if (Joi.validate(name_en, Joi.string().regex(/^[A-Za-z0-9\-]{3,24}$/).required()).error) {
      ctx.body = response.simpleError('模块英文名必须为3~24个字，且必须为英文、数字、中横线');
      return;
    }
    const res = await ctx.model.Module.findOneByName(app_id, name_cn, name_en);
    if (res) {
      ctx.body = response.simpleError('当前应用已存在该模块');
      return;
    }
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const data = await ctx.model.Module.create({
      app_id,
      name_cn,
      name_en,
      creator_id: userId,
      updater_id: userId,
    });
    if (!data) {
      ctx.body = response.simpleError('创建失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  // 通过模块Id编辑（添加/更新）定义：Json Schema / UI Schema
  async editDefinition() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { module_id, definition, ui_schema } = ctx.request.body;
    const appIdRes = await ctx.model.Module.findAppIdById(module_id);
    if (!appIdRes) {
      ctx.body = response.simpleError('找不到该模块，请刷新重试');
      return;
    }
    const { app_id } = appIdRes;
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const data = await ctx.model.Module.update({
      definition: definition,
      ui_schema: ui_schema,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        id: module_id,
      },
    });
    if (data[0] !== 1) {
      ctx.body = response.simpleError('更新失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  // 编辑关联URL
  async editAssociationUrl() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { module_id, association_url } = ctx.request.body;
    const appIdRes = await ctx.model.Module.findAppIdById(module_id);
    if (!appIdRes) {
      ctx.body = response.simpleError('找不到该模块，请刷新重试');
      return;
    }
    const { app_id } = appIdRes;
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const data = await ctx.model.Module.update({
      association_url,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        id: module_id,
      },
    });
    if (data[0] !== 1) {
      ctx.body = response.simpleError('更新失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  async list() {
    const { ctx } = this;
    const { app_id } = ctx.queries;
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const moduleListRes = await ctx.model.Module.listByAppId(app_id);
    // 获取最后更新人姓名
    let userIds = [];
    moduleListRes.forEach(moduleInfo => {
      userIds.push(moduleInfo.creator_id, moduleInfo.updater_id);
    });
    userIds = _.compact(userIds);
    userIds = _.uniq(userIds);
    const usersInfo = await ctx.model.User.findUsersByIds(userIds);
    if (!usersInfo || !usersInfo.length === 0) {
      ctx.body = response.emptySuccess();
      return;
    }
    const users = [];
    usersInfo.forEach(userInfo => {
      users[userInfo.id] = userInfo.real_name;
    });
    moduleListRes.forEach(module => {
      module.key = `module-${module.id}`;
      module.creator = users[module.creator_id];
      module.updater = users[module.updater_id];
    });
    ctx.body = response.success(moduleListRes);
  }

  async info() {
    const { ctx } = this;
    const { app_id, module_id } = ctx.queries;
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }

    const data = await ctx.model.Module.findOneById(module_id);
    if (!data || !data.dataValues) {
      // 不存在
      ctx.body = response.simpleError('模块不存在');
      return;
    }

    const { dataValues } = data;
    ctx.body = response.success(dataValues);
  }

  async delete() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { module_id } = ctx.request.body;
    const appIdRes = await ctx.model.Module.findAppIdById(module_id);
    if (!appIdRes) {
      ctx.body = response.simpleError('找不到该模块，请刷新重试');
      return;
    }
    const { app_id } = appIdRes;
    const res = await ctx.model.Application.findIdByAppIdAndOwnerId(app_id, userId);
    if (!res) {
      ctx.body = response.simpleError('权限不足');
      return;
    }
    const data = await ctx.model.Module.update({
      soft_delete: 1,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        id: module_id,
      },
    });
    if (data[0] !== 1) {
      ctx.body = response.simpleError('删除失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  async checkAuth(app_id) {
    const { ctx } = this;
    const { userId } = ctx.base;
    const res = await Promise.all([
      ctx.model.Auth.findOneByUserIdAndAppId(userId, app_id),
      ctx.model.Application.findIdByAppIdAndOwnerId(userId, app_id),
    ]);
    return res.some(item => item);
  }
}

module.exports = ModuleController;
