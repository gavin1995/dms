'use strict';

module.exports = {
  success: (data = true) => {
    return {
      success: true,
      code: 200,
      // message: '',
      data,
    };
  },

  emptySuccess: () => {
    return {
      success: true,
      code: 200,
      data: {
        count: 0,
        rows: [],
      },
    };
  },

  error: (code, message) => ({
    success: false,
    code,
    message,
  }),

  simpleError: message => ({
    success: false,
    code: 500,
    message,
  }),

  failure: (code, defaultMsg) => message => ({
    success: false,
    message: message || defaultMsg,
    code,
  }),

  serverError: () => ({
    success: false,
    message: '网络错误，请重试',
    code: 500,
  }),

  specialError: code => {
    let msg = '';
    switch (code) {
      case 1001:
        msg = '登录已过期，请重新登录';
        break;
      case 1002:
        msg = '登录已过期，请重新登录';
        break;
      default :
        msg = '服务器内部错误，请重试';
    }
    return {
      success: false,
      message: msg,
      code,
    };
  },
};

// module.exports.serverError = module.exports.failure(500, '网络错误，请重试');
