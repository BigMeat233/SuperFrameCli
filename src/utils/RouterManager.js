/**
 * 路由管理工具
 * 
 * Made By Douzi＂
 */
/**
 * 附加路由的高阶函数(装饰器)
 * @param {String} routePath - 路由维度的基础请求路径
 * @param {[Middleware]} middlewares - 路由维度的基础中间件列表
 */
export function withRouter(routePath, middlewares) {
  // 对期望设置的公共routePath进行处理
  // 去除开头多余和结尾的所有/
  routePath = routePath.replace(/^\/*/g, '/').replace(/\/*$/g, '');
  // 校正routePath的前缀
  routePath[0] !== '/' && (routePath = `/${routePath}`);

  // 使用反向继承对原始Handler进行Hack
  return (Handler) => class HandlerWithRouter extends Handler {
    // 组合路由级别的routePath和原始routePath
    static getRoutePath() {
      // 修正原始的routePath
      const originRoutePath = Handler.getRoutePath().replace(/^\/*/g, '');
      return `${routePath}/${originRoutePath}`;
    }

    // 组合路由级别的中间件和原始中间件
    async getMiddlewares(req, res) {
      const originMiddlewares = await super.getMiddlewares(req, res);
      return [...middlewares, ...originMiddlewares];
    }
  };
}