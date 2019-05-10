'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const utils = require('../util/utils');
const constants = require('../util/constants');
const response = require('../util/response');

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const data = await ctx.model.User.findPasswordByUsername(username);
    if (!data || !data.dataValues) {
      // 不存在该用户名
      ctx.body = response.simpleError('用户名或密码不正确');
      return false;
    }
    if (data.dataValues.password !== utils.md5(password)) {
      // 密码不正确
      ctx.body = response.simpleError('用户名或密码不正确');
      return false;
    }
    return this.jwtAuth(ctx, data.dataValues);
  }

  async create() {
    const { ctx } = this;
    const { username, password, employee_id, real_name, gender } = ctx.request.body;
    if (Joi.validate(username, Joi.string().replace(' ', '').min(3).max(16).required()).error) {
      ctx.body = response.simpleError('用户名为3~16位');
      return;
    }
    if (Joi.validate(password, Joi.string().regex(/^.*(?=.{6,16})(?=.*\d)(?=.*[A-Za-z]+).*$/).required()).error) {
      ctx.body = response.simpleError('密码为6~16位，必须包含数字、字母');
      return false;
    }
    if (Joi.validate(real_name, Joi.string().replace(' ', '').min(2).max(10).required()).error) {
      ctx.body = response.simpleError('真实姓名为2~10位');
      return;
    }

    const data = await ctx.model.User.findPasswordByUsername(username);
    if (data && data.dataValues) {
      // 已存在
      ctx.body = response.simpleError('用户名已存在');
      return false;
    }

    const res = await ctx.model.User.create({
      username,
      employee_id,
      real_name,
      gender, // 性别：1 男，2：女
      password: utils.md5(password),
    });

    if (!res || !res.dataValues) {
      ctx.body = response.simpleError('注册失败，请重试');
      return;
    }
    return this.jwtAuth(ctx, res.dataValues);
  }

  async edit() {
    const { ctx } = this;
    const { userId } = ctx.base;
    const { nickname, phone_number, avatar, weibo, wechat, qq, email, profile, birthday } = ctx.request.body;
    if (phone_number !== undefined && Joi.validate(phone_number, Joi.string().regex(/^((1[3-9][0-9])+\d{8})$/).required()).error) {
      ctx.body = response.simpleError('手机号格式不正确');
      return false;
    }
    const data = await ctx.model.User.update({
      nickname,
      phone_number,
      avatar,
      weibo,
      wechat,
      qq,
      email,
      profile,
      birthday,
      update_time: new Date(),
    }, {
      where: {
        id: userId,
      },
    });
    if (data[0] !== 1) {
      ctx.body = response.simpleError('更新失败，请重试');
      return;
    }
    ctx.body = response.success();
  }

  logout() {
    const { ctx } = this;
    ctx.cookies.set('token', null, {
      overwrite: true,
    });
    ctx.body = response.success();
  }

  async info() {
    const { ctx } = this;
    const { userId } = ctx.base;

    const data = await ctx.model.User.findByUserId(userId);
    if (!data || !data.dataValues) {
      // 不存在
      ctx.cookies.set('token', null, {
        overwrite: true,
      });
      ctx.body = response.simpleError('系统错误，请重新登录');
      return;
    }

    const { dataValues } = data;
    ctx.body = response.success({
      user_id: dataValues.id,
      username: dataValues.username,
      nickname: dataValues.nickname,
      real_name: dataValues.real_name,
      type: dataValues.type,
      avatar: dataValues.avatar,
      employee_id: dataValues.employee_id,
    });
  }

  async all() {
    const { ctx } = this;
    const allRes = await ctx.model.User.findAllUser();
    const res = allRes.map(item => ({
      key: `user-${item.id}`,
      user_id: item.id,
      real_name: item.real_name,
      employee_id: item.employee_id,
    }));
    ctx.body = response.success(res);
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

  jwtAuth(ctx, user) {
    const expiration = moment(moment().add(30, 'd').format('YYYY-MM-DD 00:00:00')).unix();
    const token = jwt.sign({
      username: user.username,
      userId: user.id,
      type: user.type, // 1：超管，2：开发主管；3：运营主管；4：普通开发；5：普通运营
      sub: user.id,
      iat: moment().unix(),
      exp: expiration,
    }, constants.jwtSecret);
    ctx.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      expires: moment.utc(moment().add(30, 'd').format('YYYY-MM-DD 00:00:00')).toDate(),
    });
    ctx.body = response.success();
  }
}

module.exports = UserController;
