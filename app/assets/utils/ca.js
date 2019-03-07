import axios from 'axios';
// import moment from 'moment';
import { message } from 'antd';

// 方便请求错误上报
let requestKeyInfo;

axios.interceptors.request.use(function (config) {
  requestKeyInfo = {
    headers: config.headers,
    method: config.method,
    url: config.url,
    data: config.data,
  };
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  const { data } = response;
  if (data.data === 0 || data.data === 1) {
    return data.data;
  }
  if (!data.success) {
    message.error(data.message || '网络异常，请重试');
    return false;
  }
  if (data.data === false) {
    return false;
  }
  return data.data || data.success;
}, function (e) {
  message.error('网络异常，请重试！');
  return false;
});

export default axios;

