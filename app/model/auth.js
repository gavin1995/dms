'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, UUIDV4 } = app.Sequelize;

  const Auth = app.model.define('dms_auth', {
    app_id: INTEGER(11),
    user_id: INTEGER(11),
    creator_id: INTEGER(11),
    updater_id: INTEGER(11),
    soft_delete: {
      type: INTEGER(1),
      defaultValue: 0,
    },
    create_time: {
      type: DATE,
      defaultValue: NOW,
    },
    update_time: {
      type: DATE,
      defaultValue: NOW,
    },
    create_guid: {
      type: STRING(36),
      defaultValue: UUIDV4,
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });

  Auth.findAppIdsByUserId = async userId => {
    return await Auth.findAll({
      attributes: [ 'app_id' ],
      where: {
        user_id: userId,
        soft_delete: 0,
      },
    });
  };

  Auth.findUserIdsByAppId = async appId => {
    return await Auth.findAll({
      attributes: [ 'user_id' ],
      where: {
        app_id: appId,
        soft_delete: 0,
      },
      raw: true,
    });
  };

  // 用于权限验证
  Auth.findOneByUserIdAndAppId = async (userId, appId) => {
    return await Auth.findOne({
      where: {
        user_id: userId,
        app_id: appId,
        soft_delete: 0,
      },
    });
  };

  // 更新都需要userId
  Auth.deleteAuthByAppId = async (app_id, userId) => {
    return await Auth.update({
      soft_delete: 1,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        app_id,
      },
    });
  };

  return Auth;
};
