'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const cookie = require('cookie');

const response = require('../util/response');

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.js');
  }

  async proxy() {
    const ctx = this.ctx;
    // use roadhog mock api first
    const url = 'http://127.0.0.1:8000' + ctx.path + '?' + ctx.querystring;

    const res = await this.ctx.curl(url, {
      method: this.ctx.method,
    });
    ctx.body = res.data;
    ctx.status = res.status;
  }

  test() {
    const { ctx } = this;

    const expiration = moment(moment().add(30, 'd').format('YYYY-MM-DD 00:00:00')).unix();
    ctx.cookies.set('token', 'ssasas', {
      httpOnly: true,
      path: '/',
      expires: moment.utc(moment().add(30, 'd').format('YYYY-MM-DD 00:00:00')).toDate(),
    });
    ctx.body = response.success();
  }
}

module.exports = HomeController;
