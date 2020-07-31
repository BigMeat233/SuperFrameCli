/**
 * 服务配置
 * 
 * Made By Douzi＂
 */
import UploadHandler from '@handlers/CliTest/UploadHandler';
import RemoveHandler from '@handlers/CliTest/RemoveHandler';
import DisplayHandler from '@handlers/CliTest/DisplayHandler';
import ReadFilesHandler from '@handlers/CliTest/ReadFilesHandler';

export default {
  // 服务驻留端口
  port: 3000,
  // 基础请求路径
  baseRoutePath: '/',
  // handler列表
  handlers: [
    UploadHandler,
    RemoveHandler,
    DisplayHandler,
    ReadFilesHandler,
  ],
  // 全局中间件列表
  middlewares: [],
  // 报文构造器
  messageStructure: [{
    key: 'HEAD',
    props: [
      { key: 'code', tag: 'code' },
      { key: 'sign', tag: 'sign' },
      { key: 'message', tag: 'message' },
      { key: 'timestamp', tag: 'timestamp' },
    ]
  }, {
    key: 'BODY',
    tag: 'body',
    props: [{ key: 'data', tag: 'data' }],
  }],
};