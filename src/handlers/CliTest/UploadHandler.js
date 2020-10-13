/**
 * 文件上传
 * 
 * Made By Douzi＂
 */
import WithRouter from './router';
import BaseHandler from '@utils/BaseHandler';
import FileResolver from '@modules/FileResolver';
import { createMultipartyParser } from '@middlewares/BodyParser';

/**
 * @class UploadHandler
 * @description 实现了文件上传,可通过POST请求/Upload.do删除本地文件
 */
class UploadHandler extends BaseHandler {
  /**
   * 设置请求路径
   * @override
   */
  static getRoutePath() {
    return '/Upload.do';
  }

  /**
   * 中间件列表
   * @override
   */
  getMiddlewares() {
    // 指定此Handler处理时使用multer中间件
    return [createMultipartyParser({
      files: 1,
      fileSize: 2 * 1024 * 1024,
    })];
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
    const { body, files } = req;
    const { fileName } = body;
    const file = files.find((f) => f.fieldname === 'file');
    if (!fileName || !file) {
      next(this.buildFailureMessage('必填参数为空'));
      return;
    }
    // 执行业务操作
    const fileNameInFs = await this.fileResolver.saveFile(fileName, file.buffer);
    fileNameInFs && next(this.buildSuccessMessage('文件存储成功', { fileNameInFs }));
  }
}

export default WithRouter(UploadHandler);