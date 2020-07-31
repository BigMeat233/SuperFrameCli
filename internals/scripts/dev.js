/**
 * 单次启动指令
 * 
 * Made By Douzi＂
 */
const path = require('path');
const child_process = require('child_process');
const BuildConf = require('../webpack/build.conf');

// 元数据
const target = BuildConf.dev.target;
const scriptPath = path.resolve(target.path, target.fileName);
child_process.fork(scriptPath);
