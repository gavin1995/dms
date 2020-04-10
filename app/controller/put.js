'use strict';

const { Controller } = require('egg');

const response = require('../util/response');
const { md5 } = require('../util/utils');
const oss = require('../lib/AliOSS');

class PutController extends Controller {
  async putFileByPath() {
    const { ctx, config } = this;
    const parts = ctx.multipart();
    const formFields = {};
    let part;
    while ((part = await parts()) != null) {
      if (part.length) {
        formFields[part[0]] = part[1];
      } else {
        if (!part.filename) {
          return;
        }
        const fileInfo = part.filename.split('.');
        const fileType = fileInfo[fileInfo.length - 1];
        const datetime = new Date().getTime();
        const fileName = md5(`${fileInfo[0]}${datetime}${fileType}`);
        const newFile = `${fileName}.${fileType}`;
        await oss.putFileByStream(newFile, part);
        ctx.body = response.success(`${config.aliCloud.ossStaticUrl}/${newFile}`);
      }
    }
  }
}

module.exports = PutController;
