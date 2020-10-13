/**
 * 构建配置
 * 
 * Made By Douzi＂
 */
const path = require('path');
const execPath = process.cwd();

// 快捷组建执行路径方法
const resolve = (filePath) => path.resolve(execPath, filePath);

module.exports = {
  dev: {
    devTool: 'source-map',
    entry: resolve('./index.dev.js'),
    target: {
      node: '8',
      path: resolve('./.cli-cache'),
      fileName: 'index.js',
    }
  },
  prod: {
    devTool: false,
    entry: resolve('./index.js'),
    target: {
      node: '8',
      path: resolve('./dist'),
      fileName: 'index.js',
    }
  }
};