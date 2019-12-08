import * as glob from 'glob'
import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'
import * as  Parameter from 'parameter'
import { userSchema } from '../schema'

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch'

type LoadOptions = {
    // 路由文件扩展名，默认值是`.{js,ts}` 
    extname?: string
}

type RouteOptions = {
    // 适用于某个请求比较特殊，需要单独制定前缀的情形
    prefix?: string;
    // 给当前路由添加一个或多个中间件
    middlewares?: Array<Koa.Middleware>
}

const router = new KoaRouter()
const decorate = (method: HTTPMethod, router: KoaRouter, path: string, options: RouteOptions = {}) => {
    return (target, property, decriptor) => {
        process.nextTick(() => {
            const middlewares = [];
            if (target.middlewares) {
                middlewares.push(...target.middlewares)
            }
            // 设置中间件
            if (options.middlewares) {
                middlewares.push(...options.middlewares)
            }
            // 添加路由处理
            middlewares.push(target[property])
            const url = options && options.prefix ? options.prefix + path : path;
            router[method](url, ...middlewares)
        })
    }
}
const method = method => (path: string, options?: RouteOptions) => decorate(method, router, path, options)

export const get = method('get');
export const post = method('post');
export const put = method('put');
export const del = method('del');
export const patch = method('patch');

export const middlewares = (middlewares: Koa.Middleware[]) => {
    return (target) => {
        target.prototype.middlewares = middlewares
    }
}

export const load = (folder: string, options: LoadOptions = {}): KoaRouter => {
    const extnmae = options.extname || '.{js,ts}';
    // glob循环遍历文件目录
    // 并加载目录下的文件
    // 就会执行文件里的装饰器
    // 装饰器执行decorate 加载中间件
    glob.sync(require('path').join(folder, `./**/*${extnmae}`))
        .forEach(item => require(item));
    return router
}