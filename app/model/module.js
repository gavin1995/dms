'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, UUIDV4 } = app.Sequelize;

  const Module = app.model.define('dms_module', {
    app_id: INTEGER(11),
    name_cn: STRING(64),
    name_en: STRING(64),
    definition: STRING,
    ui_schema: STRING,
    association_url: STRING(2048),
    sort: INTEGER(3),
    creator_id: INTEGER(11),
    updater_id: INTEGER(11),
    is_stop: INTEGER(1),
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

  Module.listByAppId = async appId => {
    return await Module.findAll({
      attributes: {
        exclude: [ 'definition', 'ui_schema', 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        app_id: appId,
        soft_delete: 0,
      },
      raw: true,
    });
  };

  Module.findOneByName = async (app_id, name_cn, name_en) => {
    return await Module.findOne({
      where: {
        app_id,
        $or: [
          {
            name_cn,
          },
          {
            name_en,
          },
        ],
      },
    });
  };

  Module.findOneById = async id => {
    return await Module.findOne({
      attributes: {
        exclude: [ 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        id,
        soft_delete: 0,
      },
    });
  };

  Module.findAppIdById = async id => {
    return await Module.findOne({
      attributes: [ 'app_id' ],
      where: {
        id,
        soft_delete: 0,
      },
    });
  };

  return Module;
};
