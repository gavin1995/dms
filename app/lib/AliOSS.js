const OSS = require('ali-oss');

const config = require('../../config');

class AliOSS {
  constructor() {
    this.oss = new OSS({
      region: config.aliCloud.ossRegion,
      bucket: config.aliCloud.ossBucket,
      accessKeyId: config.aliCloud.assessKeyId,
      accessKeySecret: config.aliCloud.secretAccessKey,
    });
  }

  async putJson(fileName, jsonStr) {
    try {
      const res = await this.oss.put(fileName, new Buffer(jsonStr));
      return config.aliCloud.ossStaticUrl + '/' + res.name;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async putFileByStream(fileName, stream) {
    try {
      const res = await this.oss.putStream(fileName, stream);
      return config.aliCloud.ossStaticUrl + '/' + res.name;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

const instance = new AliOSS();
Object.freeze(instance);

module.exports = instance;
