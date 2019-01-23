'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, UUIDV4 } = app.Sequelize;

  const User = app.model.define('dms_user', {
    employee_id: INTEGER(11),
    nickname: STRING(64),
    real_name: STRING(64),
    phone_number: STRING(32),
    username: STRING(64),
    password: STRING(32),
    type: INTEGER,
    avatar: STRING(1024),
    weibo: STRING(1024),
    wechat: STRING(1024),
    qq: STRING(1024),
    email: STRING(1024),
    profile: STRING(1024),
    birthday: DATE,
    gender: INTEGER(1),
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

  User.findByUsername = async username => {
    return await User.findOne({
      attributes: {
        exclude: [ 'password', 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        username,
        soft_delete: 0,
      },
    });
  };

  User.findPasswordByUsername = async username => {
    return await User.findOne({
      attributes: [ 'id', 'password' ],
      where: {
        username,
        soft_delete: 0,
      },
    });
  };

  User.findByUserId = async userId => {
    return await User.findOne({
      attributes: {
        exclude: [ 'password', 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        id: userId,
        soft_delete: 0,
      },
    });
  };

  User.findByPhoneNumber = async phone_number => {
    return await User.findOne({
      attributes: {
        exclude: [ 'password', 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        phone_number,
        soft_delete: 0,
      },
    });
  };

  User.findByLogin = async login => {
    return await this.findOne({
      attributes: {
        exclude: [ 'password', 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        login,
        soft_delete: 0,
      },
    });
  };

  // 根据用户ID批量查询
  User.findUsersByIds = async ids => {
    return await User.findAll({
      attributes: {
        exclude: [ 'password', 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        id: ids,
        soft_delete: 0,
      },
    });
  };

  User.findAllUser = async () => {
    return await User.findAll({
      attributes: {
        exclude: [ 'password', 'soft_delete', 'create_time', 'update_time', 'create_guid' ],
      },
      where: {
        soft_delete: 0,
      },
    });
  };

  return User;
};
