'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

const response = require('../util/response');

class DataController extends Controller {
  async editTempData() {
    const { ctx } = this;
    const { params, module_id, data } = ctx.request.body;
    const { userId } = ctx.base;
    const paramsData = `y${params}`;
    // 删除前面的临时数据记录
    await ctx.model.Data.deleteDataByParams(paramsData, userId);
    // 插入新的临时数据
    const createRes = await ctx.model.Data.create({
      module_id,
      params: paramsData,
      data: JSON.stringify(data),
      creator_id: userId,
      updater_id: userId,
    });

    if (!createRes) {
      ctx.body = response.simpleError('保存数据失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  // 审核通过->真实数据
  async reviewTempData() {
    const { ctx } = this;
    const { data_id } = ctx.request.body;
    const { userId } = ctx.base;
    // 查询是否有该应用的权限
    // const authRes = await this.checkAuth(app_id);
    // if (!authRes) {
    //   ctx.body = response.simpleError('抱歉，您没有当前应用权限');
    //   return;
    // }
    const tempData = await ctx.model.Data.findOneById(data_id);
    const { module_id, data, params } = tempData;
    const paramsData = `n${params.substring(1)}`;
    // 删除前面的真实数据记录
    await ctx.model.Data.deleteDataByParams(paramsData, userId);
    // 插入新的真实数据
    const createRes = await ctx.model.Data.create({
      data,
      module_id,
      params: paramsData,
      creator_id: userId,
      updater_id: userId,
    });

    if (!createRes) {
      ctx.body = response.simpleError('保存数据失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  async getTempData() {
    const { ctx } = this;
    const { params, module_id } = ctx.queries;
    const { userId } = ctx.base;
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
    const paramsData = `y${params}`;
    const dataRes = await ctx.model.Data.findOneByParams(paramsData);
    if (dataRes) {
      ctx.body = response.success(dataRes.dataValues);
      return;
    }
    ctx.body = response.success(null);
    return;
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

module.exports = DataController;
