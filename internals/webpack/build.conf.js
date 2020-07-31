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
    entry: resolve('./index.dev.js'),
    target: {
      node: '8',
      path: resolve('./.dev_cache'),
      fileName: 'index.js',
    },
    devTool: 'source-map'
  },
  prod: {
    entry: resolve('./index.js'),
    target: {
      node: '8',
      path: resolve('./dist'),
      fileName: 'index.js',
    },
    devTool: 'none'
  }
};