'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, UUIDV4 } = app.Sequelize;

  const Data = app.model.define('dms_data', {
    params: STRING(128),
    module_id: INTEGER(11),
    data: STRING,
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

  Data.findOneByParams = async params => {
    return await Data.findOne({
      where: {
        params,
        soft_delete: 0,
      },
    });
  };

  // 删除之前的数据
  Data.deleteDataByParams = async (params, userId) => {
    return await Data.update({
      soft_delete: 1,
      updater_id: userId,
      update_time: new Date(),
    }, {
      where: {
        params,
      },
    });
  };

  Data.findOneById = async id => {
    return await Data.findOne({
      where: {
        id,
        soft_delete: 0,
      },
    });
  };

  return Data;
};
