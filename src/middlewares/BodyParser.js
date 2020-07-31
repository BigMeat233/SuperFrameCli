/**
 * body解析中间件生成工具
 * 
 * Made By Douzi＂
 */
import multer from 'multer';
import bodyParser from 'body-parser';

/**
 * 创建application/json格式body的解析中间件
 * @param {Object} configs - 配置项,详情参照body-parser文档
 */
export function createJsonParser(configs) {
  return bodyParser.json(configs);
}

/**
 * 创建application/x-www-form-urlencoded格式body的解析中间件
 * @param {Object} configs - 配置项,详情参照body-parser文档
 */
export function createUrlencodeParser(configs) {
  return bodyParser.urlencoded(configs);
}

/**
 * 创建multipart/form-data格式body的解析中间件
 * @param {Object} configs - 配置项,详情参照multer文档
 */
export function createMultipartyParser(configs) {
  return multer({ limits: configs }).any();
}