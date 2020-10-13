/**
 * 应用配置
 * 
 * Made By Douzi＂
 */
import os from 'os';
import path from 'path';
import {
  APP_ENV_PRODUCTION,
  APP_ENV_DEVELOPMENT,
} from '@constants/Macros';

// 创建基础配置信息
const execPath = process.cwd();
const env = process.env.NODE_ENV === 'development'
  ? APP_ENV_DEVELOPMENT
  : APP_ENV_PRODUCTION;

// 生成App配置
export default ({ processId }) => ({
  // dev环境配置
  [APP_ENV_DEVELOPMENT]: {
    // 进程ID
    processId,
    // 运行环境
    env: APP_ENV_DEVELOPMENT,
    // Worker进程数量
    workerNum: 1,
    // handler日志配置
    handlerLoggerConf: { level: 'all' },
    // 资源目录
    resourcePath: path.resolve(execPath, './static/resource'),
    // 日志收集基础配置
    baseLoggerConf: {
      level: 'all',
      maxSize: 0,
      keepDateNum: 0,
      dateFormat: 'YYYY-MM-DD',
      sourcePath: path.resolve(execPath, `./static/logs/${processId}`),
    },
  },
  // prod环境配置
  [APP_ENV_PRODUCTION]: {
    // 进程ID
    processId,
    // 运行环境
    env: APP_ENV_PRODUCTION,
    // Worker进程数量
    workerNum: os.cpus().length,
    // handler日志配置
    handlerLoggerConf: { level: 'infos' },
    // 资源目录
    resourcePath: path.resolve(execPath, './static/resource'),
    // 日志收集基础配置
    baseLoggerConf: {
      level: 'error',
      maxSize: 10 * 1024 * 1024,
      keepDateNum: 7,
      dateFormat: 'YYYY-MM-DD',
      sourcePath: path.resolve(execPath, `./static/logs/${processId}`),
    },
  }
}[env]);