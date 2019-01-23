const path = require('path');

export default {
  entry: 'app/assets/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, './app/assets//components/'),
  },
  ignoreMomentLocale: true,
  theme: './app/assets//theme.js',
  html: {
    template: './app/assets/index.ejs',
  },
  disableDynamicImport: true,
  outputPath: 'app/public',
  // publicPath: 'app/public',
  hash: true,
};
