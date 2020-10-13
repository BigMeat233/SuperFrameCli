/**
 * 文件删除
 * 
 * Made By Douzi＂
 */
import WithRouter from './router';
import BaseHandler from '@utils/BaseHandler';
import FileResolver from '@modules/FileResolver';

/**
 * @class RemoveHandler
 * @description 实现了文件删除,可通过POST请求/Remove.do删除本地文件
 */
class RemoveHandler extends BaseHandler {
  /**
   * 请求路径
   * @override
   */
  static getRoutePath() {
    return '/Remove.do';
  }

  /**
   * 预处理
   * @override
   */
  preHandler(req, res, next) {
    this.fileResolver = new FileResolver(this.logger);
    next();
  }

  /**
   * POST处理
   * @override
   */
  async postHandler(req, res, next) {
    // 解析并校验请求参数
    const { fileName } = req.body;
    if (!fileName) {
      next(this.buildFailureMessage('必填参数为空'));
      return;
    }

    // 执行业务操作
    const fileNameInFs = await this.fileResolver.removeFile(fileName);
    fileNameInFs && next(this.buildSuccessMessage('删除成功', { fileNameInFs }));
  }
}

export default WithRouter(RemoveHandler);