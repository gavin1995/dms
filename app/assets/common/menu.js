import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '开发配置',
    icon: 'dashboard',
    path: 'development',
    children: [
      {
        name: '应用管理',
        path: 'app',
      },
    ],
  },
  {
    name: '运营配置',
    icon: 'form',
    path: 'operations',
    children: [
      {
        name: '数据管理',
        path: 'app',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
