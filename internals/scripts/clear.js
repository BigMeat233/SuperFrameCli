/**
 * 清理指令
 * 
 * Made By Douzi＂
 */
const rimraf = require('rimraf');
const BuildConf = require('../webpack/build.conf');

const devTarget = BuildConf.dev.target;
const prodTarget = BuildConf.prod.target;

// 彩色log方法
const log = (color, content) => {
  const colorConf = {
    green: [32, 39],
    red: [91, 39],
    yellow: [33, 39],
    magenta: [35, 39]
  };
  console.log(`\x1B[${colorConf[color][0]}m${content}\x1B[${colorConf[color][1]}m`);
};

// 执行清理
try {
  log('yellow', 'Will clear dev cache...\n');
  rimraf.sync(devTarget.path);
  log('green', 'Successed!\n');
  log('yellow', 'Will clear prod cache...\n');
  rimraf.sync(prodTarget.path);
  log('green', 'Successed!\n');
  log('green', 'Done!\n');
} catch (err) {
  log('red', 'Failure!');
  log('red', err);
}


