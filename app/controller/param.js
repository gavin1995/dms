'use strict';

const Controller = require('egg').Controller;
const Joi = require('joi');
const _ = require('lodash');

const response = require('../util/response');

class ParamController extends Controller {
  async create() {
    const { ctx } = this;
    const { app_id, name, title } = ctx.request.body;
    const { userId } = ctx.base;
    if (Joi.validate(name, Joi.string().regex(/^[A-Za-z]{1,12}$/).required()).error) {
      ctx.body = response.simpleError('参数名必须为1~12个英文字符，尽量简单');
      return;
    }
    // eslint-disable-next-line
    if (Joi.validate(title, Joi.string().replace(' ', '').min(1).max(24).required()).error) {
      ctx.body = response.simpleError('参数标题为1~24个字符');
      return;
    }
    const res = await ctx.model.Param.findOneByName(app_id, name, title);
    if (res) {
      ctx.body = response.simpleError('当前应用已存在该参数');
      return;
    }
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const data = await ctx.model.Param.create({
      app_id,
      name: name,
      title: title,
      creator_id: userId,
      updater_id: userId,
    });
    if (!data) {
      ctx.body = response.simpleError('创建失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  async edit() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { param_id, associate_url, associate_url_stop, value } = ctx.request.body;
    const appIdRes = await ctx.model.Param.findAppIdById(param_id);
    if (!appIdRes) {
      ctx.body = response.simpleError('找不到该参数，请刷新重试');
      return;
    }
    const { app_id } = appIdRes;
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const data = await ctx.model.Param.update({
      associate_url_stop,
      associate_url,
      value: JSON.stringify(value),
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        id: param_id,
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
    const paramListRes = await ctx.model.Param.listByAppId(app_id);
    let userIds = [];
    paramListRes.forEach(paramInfo => {
      userIds.push(paramInfo.creator_id, paramInfo.updater_id);
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
    paramListRes.forEach(param => {
      param.key = `param-${param.id}`;
      param.creator = users[param.creator_id];
      param.updater = users[param.updater_id];
    });
    ctx.body = response.success(paramListRes);
  }

  async selectList() {
    const { ctx } = this;
    const { app_id } = ctx.queries;
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const paramListRes = await ctx.model.Param.listByAppId(app_id);
    let userIds = [];
    paramListRes.forEach(paramInfo => {
      userIds.push(paramInfo.creator_id, paramInfo.updater_id);
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
    const res = await Promise.all(await paramListRes.map(async param => {
      let value = param.value;
      if (!param.associate_url_stop) {
        const apiData = await ctx.curl(param.associate_url);
        const jsonData = JSON.parse(apiData.data.toString());
        value = JSON.stringify(jsonData.data);
      }
      return {
        ...param,
        value,
        creator: users[param.creator_id],
        updater: users[param.updater_id],
      }
    }));
    ctx.body = response.success(res);
  }

  async delete() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { param_id } = ctx.request.body;
    const appIdRes = await ctx.model.Param.findAppIdById(param_id);
    if (!appIdRes) {
      ctx.body = response.simpleError('找不到该参数，请刷新重试');
      return;
    }
    const { app_id } = appIdRes;
    // 查询是否有该应用的权限
    const authRes = await this.checkAuth(app_id);
    if (!authRes) {
      ctx.body = response.simpleError('抱歉，您没有当前应用权限');
      return;
    }
    const data = await ctx.model.Param.update({
      soft_delete: 1,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        id: param_id,
      },
    });
    if (data[0] !== 1) {
      ctx.body = response.simpleError('删除失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  async info() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { param_id } = ctx.queries;

    const data = await ctx.model.Param.findOneByParamId(param_id);
    if (!data || !data.dataValues) {
      ctx.body = response.simpleError('没有该参数');
      return;
    }

    const { dataValues } = data;
    ctx.body = response.success(dataValues);
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

module.exports = ParamController;
