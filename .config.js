module.exports = {
  jwtSecret: 'winwinfe', // jwt加密key
  dmsUploadAPI: 'http://127.0.0.1:7100/api', // dms上传服务访问地址，项目地址：https://github.com/gavin1995/dms-upload
  useCloud: 'OSS', // OSS、AZURE、false
  useServerLess: false, // ALI_CLOUD、AMAZON（暂不支持）、false
  cdnPrefix: 'https://dms.oss-cn-hangzhou.aliyuncs.com/', // TODO: 请重新配置cdn前缀
  // mysql配置 TODO: 请修改
  sequelize: {
    dialect: 'mysql',
    database: 'dms',
    host: '127.0.0.1',
    port: '3306',
    username: 'root',
    password:'root1234',
    timezone: '+08:00'
  },
  // 文件上传配置
  multipart: {
    autoFields: false,
    defaultCharset: 'utf8',
    fieldNameSize: 100,
    fieldSize: '100kb',
    fields: 10,
    fileSize: '10mb',
    files: 10,
    fileExtensions: [],
    whitelist: null,
  },
  // redis配置
  redis: {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: null,
      db: 0
    }
  },
  // 生产环境日志配置
  log: {
    dir: '/opt/logs/nodejs'
  },
  // 阿里云相关配置 TODO: 请修改
  aliCloud: {
    ossRegion: 'oss-cn-hangzhou',
    ossBucket: 'dms',
    assessKeyId: 'assessKeyId',
    secretAccessKey: 'secretAccessKey',
    ossStaticUrl: 'https://dms.oss-cn-hangzhou.aliyuncs.com', // OSS访问地址前缀
  }
};
