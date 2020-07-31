
/**
 * 开发环境入口文件
 * 
 * Made By Douzi＂
 */
import path from 'path';
import BuildConf from '@webpack/build.conf';
import SourceMapSupport from 'source-map-support';

// 挂载source map
SourceMapSupport.install({
  handleUncaughtExceptions: false,
});

// 调用栈美化
const execPath = process.cwd();
const devPath = BuildConf.dev.target.path;
const offsetPath = devPath.replace(execPath, '');
const invalidPath = path.resolve(offsetPath, './webpack:');
const stackRegExp = new RegExp(invalidPath, 'g');

const prepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (err, stack) => {
  const result = prepareStackTrace(err, stack);
  return result.replace(stackRegExp, '');
};

// 执行应用入口
require('./');