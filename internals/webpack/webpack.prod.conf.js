/**
 * 构建环境webpack配置
 * 
 * Made By Douzi＂
 */
const webpack = require('webpack');
const manifest = require('../../package.json');
const BuildConf = require('./build.conf');
const WebpackBaseConf = require('./webpack.base.conf');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 元数据
const name = manifest.name;
const version = manifest.version;
const prodBuildConf = BuildConf.prod;

// 基础配置
const mode = 'production';
const entry = { main: prodBuildConf.entry };
const target = prodBuildConf.target;
const devtool = prodBuildConf.devTool;

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
  new CleanWebpackPlugin(),
  new webpack.BannerPlugin(`${name} V${version}\n\nPowered by Node-Corejs`)
];

module.exports = {
  ...WebpackBaseConf,
  mode,
  entry,
  output,
  module,
  devtool,
  plugins,
  module: {
    rules: [babelLoaderRule]
  }
};