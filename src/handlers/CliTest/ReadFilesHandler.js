/**
 * 读取文件
 * 
 * Made By Douzi＂
 */
import WithRouter from './router';
import BaseHandler from '@utils/BaseHandler';
import FileResolver from '@modules/FileResolver';

/**
 * @class ReadFilesHandler
 * @description 实现了读取文件列表功能,可通过POST请求/ReadFiles.do预览本地文件
 */
class ReadFilesHandler extends BaseHandler {
  /**
   * 请求路径
   * @override
   */
  static getRoutePath() {
    return '/ReadFiles.do';
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
    // 执行业务操作
    const fileList = await this.fileResolver.readFiles();
    fileList && next(this.buildSuccessMessage('读取成功', { fileList }));
  }
}

export default WithRouter(ReadFilesHandler);