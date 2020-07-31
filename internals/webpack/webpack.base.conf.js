/**
 * 基础webpack配置
 * 
 * Made By Douzi＂
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// 指令执行目录
const execPath = process.cwd();

// 基础webpack配置
module.exports = {
  // 构建目标
  target: 'node',
  // 不构建三方依赖
  externals: [nodeExternals()],
  // 通用别名
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(execPath, './src'),
      '@utils': path.resolve(execPath, './src/utils'),
      '@webpack': path.resolve(execPath, './internals/webpack'),
      '@configs': path.resolve(execPath, './src/configs'),
      '@modules': path.resolve(execPath, './src/modules'),
      '@handlers': path.resolve(execPath, './src/handlers'),
      '@constants': path.resolve(execPath, './src/constants'),
      '@middlewares': path.resolve(execPath, './src/middlewares'),
    }
  },
};
