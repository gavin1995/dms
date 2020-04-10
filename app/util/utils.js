'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Logger = require('egg-logger').Logger;

const config = require('../../config');

const logger = new Logger();

module.exports = {
  randomNum(min, max) {
    // 如果非数字则报错
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new Error('param invalidate,should be a number');
    }
    // 如果顺序有问题则互换位置
    if (min > max) {
      [min, max] = [max, min];
    }
    // 如果二者相等则返回一个
    if (min === max) {
      return min;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomStr(length = 6) {
    let str = 'abcdefghijklmnopqrstuvwxyz';
    // str += str.toUpperCase();
    str += '0123456789';
    let _str = '';
    for (let i = 0; i < length; i++) {
      const rand = Math.floor(Math.random() * str.length);
      _str += str[rand];
    }
    return _str;
  },

  md5(str, salt = config.jwtSecret) {
    str = str + salt;
    return crypto
      .createHash('md5')
      .update(str)
      .digest('hex');
  },

  checkAuth(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (e) {
      logger.error(e.message);
      return false;
    }
  },
};
