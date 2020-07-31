/**
 * 路由配置
 * 
 * Made By Douzi＂
 */
import {
  createJsonParser,
  createUrlencodeParser,
} from '@middlewares/BodyParser';
import {
  withRouter,
} from '@utils/RouterManager';

const middlewareConfigs = {
  limit: '2mb',
  extended: true,
};

const routerConf = {
  // 设置路由基础路径
  routePath: '/CliTest',
  // 设置路由中间件列表
  middlewares: [
    createJsonParser(middlewareConfigs),
    createUrlencodeParser(middlewareConfigs),
  ],
}

export default withRouter(routerConf.routePath, routerConf.middlewares);