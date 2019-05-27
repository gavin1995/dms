const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

export default function(webpackConfig) {
  webpackConfig.plugins.push(
    new CopyPlugin([
      {
        from: path.resolve(__dirname, './app/assets/assets'),
        to: path.resolve(__dirname, './app/public/assets')
      },
    ]),
  );
  delete webpackConfig.resolve.alias['@babel/runtime'];
  return webpackConfig;
}