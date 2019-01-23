import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';

export default async (method, url, params = {}) => {
  try {
    const { data } = await axios[method](url, qs.stringify(params));
    if (!data.success) {
      message.error(data.message || '服务器出错，请联系开发人员');
      return false;
    } else {
      return data.data || data.success;
    }
  } catch (e) {
    message.error('请求失败，请重试');
  }
};
