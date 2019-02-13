'use strict';

module.exports = {
  async checkEditModelAndDataAuth(model, userId, appId) {
    const appRes = await ctx.model.Application.findIdByAppIdAndOwnerId(userId, appId);
    const authRes = await model.Auth.findOneByUserIdAndAppId(userId, appId);
    return appRes || authRes;
  },

};
