'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, UUIDV4 } = app.Sequelize;

  const Application = app.model.define('dms_application', {
    name_cn: STRING(64),
    name_en: STRING(64),
    description: STRING(2048),
    soft_delete: {
      type: INTEGER(1),
      defaultValue: 0,
    },
    owner_id: INTEGER(11),
    updater_id: INTEGER(11),
    operation_manager_id: INTEGER(11),
    associate_url: STRING(1024),
    creator_id: INTEGER(11),
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

  Application.list = async name => {
    return await Application.findAndCountAll({
      attributes: [ 'id', 'name_cn', 'name_en', 'owner_id', 'updater_id', 'operation_manager_id', 'update_time' ],
      where: {
        $or: [
          {
            name_cn: {
              $like: `%${name}%`,
            },
          },
          {
            name_en: {
              $like: `%${name}%`,
            },
          },
        ],
        soft_delete: 0,
      },
      offset: (name - 1) * 15,
      limit: 15,
      order: [
        [ 'update_time', 'DESC' ],
      ],
    });
  };

  Application.findListByUserIdAndFilter = async (userId, appIds, page, name = '', pageSize = 15) => {
    return await Application.findAndCountAll({
      attributes: {
        exclude: [ 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        $or: [
          {
            name_cn: {
              $like: `%${name}%`,
            },
          },
          {
            name_en: {
              $like: `%${name}%`,
            },
          },
        ],
        id: appIds,
        soft_delete: 0,
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [
        [ 'update_time', 'DESC' ],
      ],
      raw: true,
    });
  };

  Application.findOneByName = async (name_cn, name_en) => {
    return await Application.findOne({
      where: {
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

  Application.findIdByAppIdAndOwnerId = async (owner_id, app_id) => {
    return await Application.findOne({
      where: {
        id: app_id,
        owner_id,
        soft_delete: 0,
      },
    });
  };

  Application.findAllList = async (owner_id, app_ids, page = 1, name = '', page_size = 15) => {
    page = parseInt(page, 10);
    page_size = parseInt(page_size, 10);
    return await Application.findAndCountAll({
      attributes: {
        exclude: [ 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        $and: [
          {
            $or: [
              {
                id: app_ids,
              },
              {
                owner_id,
              },
            ],
          },
          {
            $or: [
              {
                name_cn: {
                  $like: `%${name}%`,
                },
              },
              {
                name_en: {
                  $like: `%${name}%`,
                },
              },
            ],
          }
        ],
        soft_delete: 0,
      },
      offset: (page - 1) * page_size,
      limit: page_size,
      order: [
        [ 'update_time', 'DESC' ],
      ],
      raw: true,
    });
  };

  return Application;
};
