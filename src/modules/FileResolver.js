/**
 * 文件处理模块
 * 
 * Made By Douzi＂
 */
import fs from 'fs';
import path from 'path';
import Core from 'node-corejs';
import StateCenter from '@utils/StateCenter';
import { APP_STATE_FIELD_KEY_CONF } from '@constants/Macros';

class FileResolver {
  constructor(logger) {
    this.logger = logger;
    const { resourcePath } = StateCenter.getState(APP_STATE_FIELD_KEY_CONF);
    this.sourcePath = resourcePath;
    Core.Utils.ensureDirSync(resourcePath);
  }

  /**
   * 存储文件
   * @param {String} fileName - 文件名
   * @param {Buffer} buffer - 文件buffer
   */
  saveFile(fileName, buffer) {
    const funcName = '存储文件';
    return new Promise(async (resolve, reject) => {
      this.log('i', funcName, Core.Utils.buildMessage('存储外部文件至本地文件系统,文件名为[${fileName}]', { fileName }));

      // 检测同名文件
      this.log('t', funcName, '检测文件系统中是否已存在同名文件...');
      const filePath = path.resolve(this.sourcePath, fileName);
      const isExists = await this._isFileExists(filePath);
      if (isExists) {
        const errMsg = '文件系统中存在同名文件,无法进行存储';
        this.log('e', funcName, errMsg);
        reject(new Error(errMsg));
        return;
      }

      // 进行写入
      this.log('t', funcName, '文件系统中不存在同名文件,开始进行写入...');
      const err = await this._saveFile(filePath, buffer).catch((err) => err);
      if (!err) {
        this.log('i', funcName, '文件存储成功');
        resolve(fileName);
      } else {
        this.log('e', funcName, '文件存储失败');
        reject(err);
      }
    });
  }

  /**
   * 删除文件
   * @param {String} fileName - 文件名
   */
  removeFile(fileName) {
    const funcName = '删除文件';
    return new Promise(async (resolve, reject) => {
      this.log('i', funcName, Core.Utils.buildMessage('在文件系统中删除文件[${fileName}]', { fileName }));

      // 删除文件
      const filePath = path.resolve(this.sourcePath, fileName);
      const err = await this._removeFile(filePath).catch((err) => err);
      if (!err) {
        this.log('i', funcName, '文件删除成功');
        resolve(fileName);
      } else {
        this.log('e', funcName, '文件删除失败');
        reject(err);
      }
    });
  }

  /**
   * 读取文件列表
   */
  readFiles() {
    const funcName = '读取文件列表';
    return new Promise(async (resolve, reject) => {
      this.log('i', funcName, '读取本地文件系统中的文件列表');

      // 读取文件系统
      const fileList = await this._readFileList(this.sourcePath).catch(() => null);
      if (fileList) {
        this.log('i', funcName, '读取文件列表成功');
        resolve(fileList);
      } else {
        const errMsg = '读取文件列表失败';
        this.log('e', funcName, errMsg);
        reject(new Error(errMsg));
      }
    });
  }

  /**
   * 检查文件是否存在
   * @param {String} filePath - 文件绝对路径
   */
  _isFileExists(filePath) {
    return new Promise((resolve) => {
      fs.access(filePath, (err) => resolve(!err));
    });
  }

  /**
   * 存储文件至本地文件系统
   * @param {String} filePath - 文件绝对路径
   * @param {Buffer} buffer - 文件buffer
   */
  _saveFile(filePath, buffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => err ? reject(err) : resolve());
    });
  }

  /**
   * 从本地文件系统删除文件
   * @param {String} filePath - 文件绝对路径
   */
  _removeFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => err ? reject(err) : resolve());
    });
  }

  /**
   * 读取本地文件系统中的文件列表
   * @param {String} dirPath - 目录绝对路径
   */
  _readFileList(dirPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => err ? reject(err) : resolve(files));
    });
  }

  log(...args) {
    this.logger && this.logger.log(...args);
  }
}

export default FileResolver;