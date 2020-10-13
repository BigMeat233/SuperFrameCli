/**
 * Handler输出组
 * 
 * Made By Douzi＂
 */
import Core from 'node-corejs';
import {
  DATE_FORMAT_MILLISECOND,
} from '@constants/Macros';
import {
  HANDLER_LOGGER_LEVEL,
  HANDLER_LOGGER_START_MESSAGE,
  HANDLER_LOGGER_CLOSE_MESSAGE,
  HANDLER_LOGGER_START_FUNCNAME,
  HANDLER_LOGGER_CLOSE_FUNCNAME,
} from '@constants/Messages';

class HandlerLogger extends Core.GroupLogger {
  /**
   * 初始化输出器
   * @override
   */
  initLogger(configs) {
    super.initLogger(configs);
    // 创建记录Handler开始处理时间点的实例属性
    this.startTime = null;
  }

  /**
   * 输出器启动
   * @override
   */
  onStart() {
    // 尝试执行原始启动逻辑
    // 在原始启动逻辑执行失败时不再执行后续逻辑
    super.onStart();

    // 启动成功时记录启动时间并输出开始日志
    this.startTime = new Date();
    this.log(
      HANDLER_LOGGER_LEVEL,
      HANDLER_LOGGER_START_FUNCNAME,
      Core.Utils.buildMessage(HANDLER_LOGGER_START_MESSAGE, {
        timestamp: this._formatDate(this.startTime)
      })
    );
  }

  /**
   * 输出器关闭
   * @override
   */
  onClose() {
    // 检测当前状态是否允许输出日志
    // 允许输出日志时将记录关闭时间并输出日志
    if (this.onCheckState(Core.Macros.BASE_LOGGER_CHECK_TYPE_CAN_LOG)) {
      const closeTime = new Date();
      this.log(
        HANDLER_LOGGER_LEVEL,
        HANDLER_LOGGER_CLOSE_FUNCNAME,
        Core.Utils.buildMessage(HANDLER_LOGGER_CLOSE_MESSAGE, {
          timestamp: this._formatDate(closeTime),
          duration: closeTime - this.startTime
        })
      );
    }

    // 执行原始的关闭逻辑
    super.onClose();
  }

  /**
   * 日期格式化(内部调用)
   * @param {Date} date - 格式化为字符串的时间戳
   */
  _formatDate(date) {
    return Core.Utils.formatDate(date, DATE_FORMAT_MILLISECOND);
  }
}

export default HandlerLogger;