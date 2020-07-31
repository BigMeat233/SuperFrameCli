/**
 * 基础Handler
 * 
 * Made By Douzi＂
 */
import path from 'path';
import Core from 'node-corejs';
import StateCenter from '@utils/StateCenter';
import HandlerLogger from '@utils/HandlerLogger';
import {
  RESPONSE_CODE,
  APP_STATE_FIELD_KEY_CONF,
  APP_STATE_FIELD_KEY_MESSAGE_STRUCTOR,
  APP_STATE_FIELD_KEY_HANDLER_LOGGER_CORE,
} from '@constants/Macros';

class BaseHandler extends Core.Handler {
  /**
   * Handler初始化
   * @override
   */
  initHandler(req) {
    // 准备请求基础数据
    const { method, baseUrl } = req;
    const reqDirPath = path.dirname(baseUrl);
    const filePrefix = path.basename(baseUrl);
    const loggerCore = StateCenter.getState(APP_STATE_FIELD_KEY_HANDLER_LOGGER_CORE);
    const {
      baseLoggerConf,
      handlerLoggerConf,
    } = StateCenter.getState(APP_STATE_FIELD_KEY_CONF);
    const { level } = handlerLoggerConf;
    const { sourcePath } = baseLoggerConf;

    // 获取报文解析/构造器并挂载至实例
    this.messageStructor = StateCenter.getState(APP_STATE_FIELD_KEY_MESSAGE_STRUCTOR);

    // 创建和启动链路日志输出器并挂载至实例
    this.logger = loggerCore.createGroupLogger(HandlerLogger, {
      level,
      params: {
        filePrefix,
        dateAsFileName: false,
        filePrefixAsFileName: false,
        fileName: `${method}-[%RANDOM_FILE_NAME%]`,
        sourcePath: path.join(sourcePath, reqDirPath),
      }
    });
    this.logger.start();
  }

  /**
   * Handler析构
   * @override
   */
  destroyHandler() {
    // 关闭日志输出器
    this.logger.close();
  }

  /**
   * 统一错误处理
   * @override
   */
  onError(error, req, res) {
    this.log(error);
    res.status(500).send(this.buildFailureMessage(error.message, {}, RESPONSE_CODE.OTHER));
  }

  /**
   * 快捷日志输出
   * @param  {...any} args - 日志参数
   */
  log(...args) {
    this.logger && this.logger.log(...args);
  }

  /**
   * 构建成功报文
   * @param {String} message - 成功信息
   * @param {Any} [data = {}] - 成功附属数据
   */
  buildSuccessMessage(message, data = {}) {
    return this.messageStructor.buildMessage({
      data,
      message,
      code: RESPONSE_CODE.SUCCESS,
    })
  }

  /**
   * 构建失败报文
   * @param {String} message - 错误信息
   * @param {Any} [data = {}] - 失败附属信息
   * @param {String|Number} [code = RESPONSE_CODE.FAILURE] - 错误码
   */
  buildFailureMessage(message, data = {}, code = RESPONSE_CODE.FAILURE) {
    return this.messageStructor.buildMessage({
      data,
      message,
      code: code + '',
    });
  }
}

export default BaseHandler;