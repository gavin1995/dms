'use strict';

const Controller = require('egg').Controller;
const Joi = require('joi');
const _ = require('lodash');

const response = require('../util/response');

class ApplicationController extends Controller {
  async create() {
    const { ctx } = this;
    const { name_cn, name_en, description, operation_manager_id, associate_url } = ctx.request.body;
    if (Joi.validate(name_cn, Joi.string().replace(' ', '').min(3).max(24).required()).error) {
      ctx.body = response.simpleError('应用中文名为3~24个字符');
      return;
    }
    if (Joi.validate(name_en, Joi.string().regex(/^[A-Za-z0-9\-]{3,24}$/).required()).error) {
      ctx.body = response.simpleError('应用英文名必须为3~24个字，且必须为英文、数字、中横线');
      return;
    }
    const res = await ctx.model.Application.findOneByName(name_cn, name_en);
    if (res) {
      ctx.body = response.simpleError('应用已存在');
      return;
    }
    const { userId } = ctx.base;
    const data = await ctx.model.Application.create({
      name_cn: name_cn,
      name_en: name_en,
      description,
      operation_manager_id,
      associate_url: associate_url,
      owner_id: userId,
      updater_id: userId,
      creator_id: userId,
    });
    if (!data) {
      ctx.body = response.simpleError('创建失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  async edit() {
    const { ctx } = this;
    const { app_id, description, operation_manager_id, associate_url, owner_id } = ctx.request.body;
    const { userId } = ctx.base;
    const res = await ctx.model.Application.findIdByAppIdAndOwnerId(userId, app_id);
    if (!res) {
      ctx.body = response.simpleError('权限不足');
      return;
    }
    const data = await ctx.model.Application.update({
      description: ctx.helper.escape(description),
      operation_manager_id,
      associate_url: associate_url,
      owner_id,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        id: app_id,
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
    // const page = ctx.params.page || 1;
    // const { page, name, page_size } = ctx.params;
    const { page, name, page_size } = ctx.queries;
    const { userId, type } = ctx.base; // 1：超管，2：开发主管；3：运营主管；4：普通开发；5：普通运营
    // 获取当前拥有权限的应用ids
    let appList;
    if (type === 1) {
      // 超管
      appList = await ctx.model.Application.findSuAllList(page, name, page_size);
    } else {
      // 非超管
      const appIdsObj = await ctx.model.Auth.findAppIdsByUserId(userId);
      const appIds = appIdsObj.map(appIdObj => appIdObj.app_id);
      appList = await ctx.model.Application.findAllList(userId, appIds, page, name, page_size);
    }
    let userIds = [];
    appList.rows.forEach(appInfo => {
      userIds.push(appInfo.owner_id, appInfo.updater_id, appInfo.operation_manager_id, appInfo.creator_id);
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
    appList.rows.forEach(app => {
      app.key = `app-${app.id}`;
      app.owner = users[app.owner_id];
      app.updater = users[app.updater_id];
      app.operation_manager = users[app.operation_manager_id] || '';
      app.creator = users[app.creator_id];
    });
    ctx.body = response.success(appList);
  }

  async delete() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { app_id } = ctx.request.body;
    const res = await ctx.model.Application.findIdByAppIdAndOwnerId(userId, app_id);
    if (!res) {
      ctx.body = response.simpleError('权限不足');
      return;
    }
    const data = await ctx.model.Application.update({
      soft_delete: 1,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        id: app_id,
      },
    });
    if (data[0] !== 1) {
      ctx.body = response.simpleError('删除失败，请重试');
      return;
    }
    ctx.body = response.success();
  }
}

module.exports = ApplicationController;
