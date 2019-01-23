'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, UUIDV4 } = app.Sequelize;

  const Param = app.model.define('dms_param', {
    app_id: INTEGER(11),
    name: STRING(64),
    title: STRING(64),
    value: STRING,
    associate_url: STRING(64),
    associate_url_stop: INTEGER(1),
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

  Param.findOneByName = async (app_id, name, title) => {
    return await Param.findOne({
      where: {
        app_id,
        $or: [
          {
            name,
          },
          {
            title,
          },
        ],
      },
    });
  };

  Param.findAppIdById = async id => {
    return await Param.findOne({
      attributes: [ 'app_id' ],
      where: {
        id,
        soft_delete: 0,
      },
    });
  };

  Param.listByAppId = async appId => {
    return await Param.findAll({
      attributes: {
        exclude: [ 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        app_id: appId,
        soft_delete: 0,
      },
      raw: true,
    });
  };

  Param.findOneByParamId = async paramId => {
    return await Param.findOne({
      attributes: {
        exclude: [ 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        id: paramId,
        soft_delete: 0,
      },
    });
  };

  return Param;
};
