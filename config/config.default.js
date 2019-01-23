'use strict';

const path = require('path');
const response = require('../app/util/response');

module.exports = appInfo => {
  const config = {
    sequelize: {
      dialect: 'mysql',
      database: 'winwinfe_dms',
      host: '127.0.0.1',
      port: '3306',
      username: 'root',
      password: 'root1234',
      timezone: '+08:00',
    },
    security: {
      csrf: {
        ignore: () => true,
      },
    },
    redis: {
      client: {
        port: 6379,
        host: '127.0.0.1',
        password: null,
        db: 0,
      },
    },
  };

  config.view = {
    root: path.join(appInfo.baseDir, 'app/assets'),
    mapping: {
      '.js': 'assets',
    },
  };

  config.assets = {
    publicPath: '/public',
    devServer: {
      command: 'roadhog dev',
      port: 8000,
      env: {
        BROWSER: 'none',
        ESLINT: 'none',
        SOCKET_SERVER: 'http://127.0.0.1:8000',
        PUBLIC_PATH: 'http://127.0.0.1:8000',
      },
      debug: true,
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1525738779809_7566';

  // add your config here
  config.middleware = [
    'auth',
  ];

  config.onerror = {
    all(err, ctx) {
      ctx.status = 500;
      ctx.set('Content-Type', 'application/json');
      ctx.body = JSON.stringify(response.simpleError('系统错误，请重试'));
    },
  };

  config.logger = {
    consoleLevel: 'INFO',
    dir: '/opt/logs/nodejs',
    appLogName: `${appInfo.name}-app.log`, // 应用相关日志，供应用开发者使用的日志。我们在绝大数情况下都在使用它
    coreLogName: `${appInfo.name}-core.log`, // 框架内核、插件日志
    agentLogName: `${appInfo.name}-agent.log`, // agent 进程日志，框架和使用到 agent 进程执行任务的插件会打印一些日志到这里。
    errorLogName: `${appInfo.name}-error.log`, // 实际一般不会直接使用它，任何 logger 的 .error() 调用输出的日志都会重定向到这里，重点通过查看此日志定位异常。
  };

  config.customLogger = {
    httpRequestLogger: {
      file: path.join(appInfo.root, `opt/logs/nodejs/${appInfo.name}-request.log`),
    },
    proxyLogger: {
      file: path.join(appInfo.root, `opt/logs/nodejs/${appInfo.name}-proxy.log`),
    },
  };

  return config;
};
