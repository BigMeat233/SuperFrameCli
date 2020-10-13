/**
 * 文件预览
 * 
 * Made By Douzi＂
 */
import express from 'express';
import WithRouter from './router';
import StateCenter from '@utils/StateCenter';
import BaseHandler from '@utils/BaseHandler';
import { APP_STATE_FIELD_KEY_CONF } from '@constants/Macros';

/**
 * @class DisplayHandler
 * @description 实现了上传文件的预览功能,可通过请求/Display/[fileName]预览本地文件
 *              通过在Handler中间件列表中推入express.static中间件实现
 */
class DisplayHandler extends BaseHandler {
  /**
   * 请求路径
   * @override
   */
  static getRoutePath() {
    return '/Display/';
  }

  /**
   * 中间件列表
   * @override
   */
  getMiddlewares() {
    const { resourcePath } = StateCenter.getState(APP_STATE_FIELD_KEY_CONF);
    return [express.static(resourcePath)];
  }
}

export default WithRouter(DisplayHandler);
