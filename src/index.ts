import * as Koa from "koa";
import * as bodify from 'koa-body';
import * as serve from 'koa-static';
import * as timing from 'koa-xtime';
import { load } from './utils/decors';
import { resolve } from 'path'
import { Sequelize } from 'sequelize-typescript';

// 建立连接
const database = new Sequelize({
  port: 3306,
  // host: "localhost",
  database: 'demo',
  username: 'root',
  password: '1988',
  dialect: 'mysql',
  define: {
    timestamps: true,
    charset: 'utf8',
  },
  modelPaths: [`${__dirname}/model`],
});

const app = new Koa()
// 处理post请求时的参数
app.use(
  bodify({
    multipart: true,
    strict: false
  })
)
app.use(timing())

app.use(serve(`${__dirname}/public`))

// 加载中间件
const router = load(resolve(__dirname, './routes'))
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
    app.emit('error', err, this)
    const status = err.status || 500
    // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
    const error = err.message
    // 从 error 对象上读出各个属性，设置到响应中
    ctx.body = {
      code: status, // 服务端自身的处理逻辑错误(包含框架错误500 及 自定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
      error: error
    }
    if (status === 422) {
      ctx.body.detail = err.errors
    }
    ctx.status = 200
  }
})
app.use(router.routes())

app.listen(3000, () => {
  console.log('服务器启动成功   3000')
})