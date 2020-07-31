/**
 * 开发环境webpack配置
 * 
 * Made By Douzi＂
 */
const path = require('path');
const notifier = require('node-notifier');
const BuildConf = require('./build.conf');
const WebpackBaseConf = require('./webpack.base.conf');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 元数据
const devBuildConf = BuildConf.dev;

// 基础配置
const mode = 'development';
const target = devBuildConf.target;
const devtool = devBuildConf.devTool;
const entry = { main: devBuildConf.entry };

// 输出配置
const output = {
  path: target.path,
  filename: target.fileName
};

// babel配置
const babelLoaderRule = {
  test: /\.js$/,
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    cacheCompression: false,
    presets: [
      ['@babel/preset-env', { targets: { node: target.node } }]
    ],
  }
}

// 插件配置
const plugins = [
  // 构建前自动进行清理
  new CleanWebpackPlugin(),
  // 构建状态美化插件
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [
        'Run "npm run dev" to start and reload application!\n',
      ],
    },
    onErrors(severity, errors) {
      if (severity !== 'error') {
        return;
      }
      // 当构建失败时使用notifier进行系统提示
      const error = errors[0];
      const filename = error.file && error.file.split('!').pop();
      notifier.notify({
        title: 'DZCli For Node-Corejs',
        message: severity + ': ' + error.name,
        subtitle: filename || '',
        icon: path.join(process.cwd(), './internals/webpack/logo.png')
      });
    }
  })
];

module.exports = {
  ...WebpackBaseConf,
  mode,
  entry,
  output,
  devtool,
  plugins,
  module: {
    rules: [babelLoaderRule]
  },
  watch: true,
  stats: 'errors-only'
};