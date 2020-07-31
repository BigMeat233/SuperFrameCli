/**
 * 应用入口
 * 
 * Made By Douzi＂
 */
import Core from 'node-corejs';
import AppConf from '@configs/app.conf';
import StateCenter from '@utils/StateCenter';
import TagStructure from '@utils/TagStructure';
import ServiceConf from '@configs/service.conf';
import {
  APP_STATE_FIELD_KEY_ENV,
  APP_STATE_FIELD_KEY_CONF,
  APP_STATE_FIELD_KEY_CORE_LOGGER,
  APP_STATE_FILED_KEY_SERVICE_CORE,
  APP_STATE_FIELD_KEY_MESSAGE_STRUCTOR,
  APP_STATE_FIELD_KEY_HANDLER_LOGGER_CORE,
} from '@constants/Macros';

class AppMain extends Core.AppMain {
  /**
   * 处理进程初始化
   * @override
   */
  onProcessDidInit(processId, launchParams) {
    super.onProcessDidInit(processId, launchParams);
    // 创建基础资源并推入状态中心
    const appConf = AppConf({ processId });
    const { env, workerNum, baseLoggerConf } = appConf;
    StateCenter.setState(APP_STATE_FIELD_KEY_CONF, appConf);
    StateCenter.setState(APP_STATE_FIELD_KEY_ENV, appConf.env);
    const coreLogger = this._buildCoreLogger(env, baseLoggerConf);
    StateCenter.setState(APP_STATE_FIELD_KEY_CORE_LOGGER, coreLogger);

    // 根据进程环境执行实际业务
    // 1. 在Master进程中创建Worker进程
    if (processId === 'M') {
      Core.ClusterCore.fork(workerNum);
    }
    // 2. 在Worker进程中执行Web Service相关业务
    else {
      // 创建核心ServiceCore和Handler日志收集使用的LoggerCore并推入状态中心
      const serviceCore = this._buildServiceCore(coreLogger, ServiceConf);
      StateCenter.setState(APP_STATE_FILED_KEY_SERVICE_CORE, serviceCore);
      const messageStructor = this._buildMessageStructor(ServiceConf);
      StateCenter.setState(APP_STATE_FIELD_KEY_MESSAGE_STRUCTOR, messageStructor);
      const handlerLoggerCore = this._buildHandlerLoggerCore(env, baseLoggerConf);
      StateCenter.setState(APP_STATE_FIELD_KEY_HANDLER_LOGGER_CORE, handlerLoggerCore);
    }
  }

  /**
   * 创建全局日志输出器
   * @param {String} env - 运行环境
   * @param {Object} baseLoggerConf - 基础输出器配置
   */
  _buildCoreLogger(env, baseLoggerConf) {
    const {
      level,
      maxSize,
      dateFormat,
      sourcePath,
      keepDateNum,
    } = baseLoggerConf;
    return new Core.DateLogger({
      env,
      level,
      params: {
        maxSize,
        dateFormat,
        sourcePath,
        keepDateNum,
        filePrefix: 'Core',
      }
    });
  }

  /**
   * 创建Handler日志收集使用的LoggerCore(Worker进程)
   * @param {String} env - 运行环境
   * @param {Object} baseLoggerConf - 基础输出器配置
   */
  _buildHandlerLoggerCore(env, baseLoggerConf) {
    const {
      level,
      maxSize,
      dateFormat,
      sourcePath,
      keepDateNum,
    } = baseLoggerConf;
    return new Core.LoggerCore({
      env,
      level,
      loggers: [{
        type: Core.FileLogger,
        buildTrigger: 'create',
        startTrigger: 'normal',
        closeTrigger: 'normal',
        params: { auto: false }
      }],
      params: {
        maxSize,
        dateFormat,
        sourcePath,
        keepDateNum,
      }
    });
  }

  /**
   * 创建ServiceCore(Worker进程)
   * @param {Logger} logger - 收集运行情况的输出器
   * @param {Object} serviceConf - 服务配置
   */
  _buildServiceCore(logger, serviceConf) {
    const {
      port,
      handlers,
      middlewares,
      baseRoutePath,
    } = serviceConf;
    const serviceCore = new Core.ServiceCore({
      port,
      middlewares,
      baseRoutePath,
    });
    serviceCore.logger = logger;
    serviceCore.bind(handlers);
    serviceCore.start();
    return serviceCore;
  }

  /**
   * 创建报文解析/构造器(Worker进程)
   * @param {Object} serviceConf - 服务配置
   */
  _buildMessageStructor(serviceConf) {
    const { messageStructure } = serviceConf;
    const messageStructor = new TagStructure(messageStructure);
    return messageStructor;
  }

  /**
   * 处理子进程退出
   * @override
   */
  onWorkerProcessDidExit(exitedProcessId, exitedDetail, reboot) {
    reboot();
  }
}

export default AppMain;