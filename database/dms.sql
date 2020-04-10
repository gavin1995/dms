CREATE DATABASE IF NOT EXISTS `dms`;

USE dms;

DROP TABLE IF EXISTS `dms_user`;
CREATE TABLE `dms_user` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `employee_id` varchar(64) NOT NULL COMMENT '工号',
  `nickname` varchar(64) DEFAULT NULL COMMENT '昵称（自动生成）',
  `real_name` varchar(64) DEFAULT NULL COMMENT '真实姓名',
  `phone_number` varchar(32) DEFAULT NULL COMMENT '手机号',
  `username` varchar(64) NOT NULL COMMENT '用户名',
  `password` varchar(32) NOT NULL COMMENT '登录密码',
  `type` TINYINT UNSIGNED NOT NULL DEFAULT 4 COMMENT '用户类型：1：超管，2：开发主管；3：运营主管；4：普通开发；5：普通运营',
  `avatar` varchar(1024) DEFAULT NULL COMMENT '头像图片地址',
  `weibo` varchar(1024) DEFAULT NULL COMMENT '绑定微博',
  `wechat` varchar(1024) DEFAULT NULL COMMENT '绑定微信',
  `qq` varchar(1024) DEFAULT NULL COMMENT '绑定QQ',
  `email` varchar(1024) DEFAULT NULL COMMENT '绑定点子邮箱',
  `profile` varchar(1024) DEFAULT NULL COMMENT '个人简介',
  `birthday` datetime DEFAULT NULL COMMENT '生日时间',
  `gender` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '性别：1：男，2：女',
  `soft_delete` TINYINT UNSIGNED DEFAULT 0 COMMENT '未删除/已删除：0/1',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `create_guid` varchar(36) NOT NULL COMMENT '全局数据唯一标识',
  KEY(username,soft_delete),
  KEY(username,password,soft_delete),
  KEY(phone_number,soft_delete),
  KEY(phone_number,password,soft_delete),
  KEY(nickname,soft_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

DROP TABLE IF EXISTS `dms_application`;
CREATE TABLE `dms_application` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name_cn` varchar(64) NOT NULL COMMENT '应用中文名',
  `name_en` varchar(64) NOT NULL COMMENT '应用英文名',
  `description` varchar(2048) DEFAULT NULL COMMENT '应用描述',
  `soft_delete` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未删除/已删除：0/1',
  `owner_id` int(11) NOT NULL COMMENT '应用所有者ID',
  `updater_id` int(11) NOT NULL COMMENT '最后更新人ID',
  `operation_manager_id` int(11) DEFAULT 0 COMMENT '运营人员ID',
  `associate_url` varchar(1024) DEFAULT NULL COMMENT '关联网址',
  `creator_id` int(11) NOT NULL COMMENT '应用创建人ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `create_guid` varchar(36) NOT NULL COMMENT '全局数据唯一标识',
  KEY(name_cn,soft_delete),
  KEY(name_en,soft_delete),
  KEY(owner_id,soft_delete),
  KEY(updater_id,soft_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='应用管理表';

DROP TABLE IF EXISTS `dms_param`;
CREATE TABLE `dms_param` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `app_id` int(11) NOT NULL COMMENT '所属应用ID',
  `name` varchar(64) DEFAULT NULL COMMENT '请求参数名',
  `value` text DEFAULT NULL COMMENT '参数值,e.g:城市id/城市名',
  `title` varchar(64) DEFAULT NULL COMMENT '表单展示标题,e.g.城市',
  `associate_url` varchar(1024) DEFAULT NULL COMMENT '参数关联网址',
  `associate_url_stop` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未停用/已停用：0/1',
  `soft_delete` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未删除/已删除：0/1',
  `creator_id` int(11) NOT NULL COMMENT '创建人ID',
  `updater_id` int(11) NOT NULL COMMENT '最后更新人ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `create_guid` varchar(36) NOT NULL COMMENT '全局数据唯一标识',
  KEY(app_id,soft_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='应用请求参数表';

DROP TABLE IF EXISTS `dms_auth`;
CREATE TABLE `dms_auth` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `app_id` int(11) NOT NULL COMMENT '所属应用ID',
  `user_id` int(11) NOT NULL COMMENT 'User_ID',
  `creator_id` int(11) NOT NULL COMMENT '权限添加人ID',
  `updater_id` int(11) NOT NULL COMMENT '最后更新人ID',
  `soft_delete` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未删除/已删除：0/1',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `create_guid` varchar(36) NOT NULL COMMENT '全局数据唯一标识',
  KEY(user_id,soft_delete),
  KEY(app_id,soft_delete),
  KEY(app_id,user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='应用权限拥有者表';

DROP TABLE IF EXISTS `dms_module`;
CREATE TABLE `dms_module` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `app_id` int(11) NOT NULL COMMENT '所属应用ID',
  `name_cn` varchar(64) NOT NULL COMMENT '模块中文名',
  `name_en` varchar(64) NOT NULL COMMENT '模块英文名',
  `definition` text DEFAULT NULL COMMENT '模块定义',
  `ui_schema` text DEFAULT NULL COMMENT '模块UISchema',
  `sort` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '模块排序',
  `association_url` varchar(1024) DEFAULT NULL COMMENT '模块关联审核地址',
  `creator_id` int(11) NOT NULL COMMENT '模块创建人ID',
  `updater_id` int(11) NOT NULL COMMENT '最后更新人ID',
  `is_stop` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未停用/已停用：0/1',
  `soft_delete` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未删除/已删除：0/1',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `create_guid` varchar(36) NOT NULL COMMENT '全局数据唯一标识',
  KEY(app_id,soft_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='应用模块表';

DROP TABLE IF EXISTS `dms_data`;
CREATE TABLE `dms_data` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `params` varchar(128) DEFAULT NULL COMMENT '请求参数的唯一标示：:isTemp(y/n)/app_id/module_id/param_1/value_1/param_2/value_2',
  `module_id` int(11) NOT NULL COMMENT '对应模块ID',
  `data` text NOT NULL COMMENT '真实数据',
  `creator_id` int(11) NOT NULL COMMENT '创建人ID',
  `updater_id` int(11) NOT NULL COMMENT '最后更新人ID',
  `is_stop` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未停用/已停用：0/1',
  `soft_delete` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '未删除/已删除：0/1',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '最后修改时间',
  `create_guid` varchar(36) NOT NULL COMMENT '全局数据唯一标识',
  KEY(params,soft_delete)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='模块真实数据';
