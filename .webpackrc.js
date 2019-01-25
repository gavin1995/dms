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
  es5ImcompatibleVersions: true,
  disableDynamicImport: true,
  publicPath: 'app/public',
  hash: true,
  manifest: {
    fileName: "../../config/manifest.json",
  },
};
