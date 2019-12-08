import * as Koa from "koa";
import { get, post, middlewares } from '../utils/decors'
import model from '../model/user'
import { userSchema, userAddSchema, headerSchema } from '../schema'
import { getSuccessResult, getErrorResult } from '../utils/result'

@middlewares([
    async (ctx: Koa.Context, next: () => Promise<any>) => {
        try {
            await headerSchema.validateAsync({ token: ctx.header.token })
            await next()
        } catch (e) {
            ctx.body = getErrorResult(e)
        }
    }
])
export default class User {
    @get('/favicon.ico')
    public nodata(ctx: Koa.Context) {
        ctx.body = ''
    }
    // 查询全部数据
    @get('/users')
    public async list(ctx: Koa.Context) {
        const data = await model.findAll()
        console.log(data)
        ctx.body = getSuccessResult({ data })
    }

    // 按条件查询数据
    @post('/users/find', {
        middlewares: [
            async (ctx: Koa.Context, next: () => Promise<any>) => {
                try {
                    await userSchema.validateAsync(ctx.request.body)
                    await next()
                } catch (e) {
                    ctx.body = getErrorResult(e)
                }
            }
        ]
    })
    public async find(ctx: Koa.Context) {
        const paramas = ctx.request.body
        const data = await model.findAll({
            where: {
                ...paramas
            }
        })
        ctx.body = getSuccessResult({ data })
    }
    // 添加数据
    @post('/users/add', {
        middlewares: [
            async (ctx: Koa.Context, next: () => Promise<any>) => {
                try {
                    await userAddSchema.validateAsync(ctx.request.body)
                    await next()
                } catch (e) {
                    ctx.body = getErrorResult(e)
                }
            }
        ]
    })
    public async add(ctx: Koa.Context) {
        // let data = await model.findAll()
        // const id = (data.sort((a, b) => b.id - a.id)[0] || 0)
        // console.log(id)
        const params = {
            name: ctx.request.body.name,
        }
        const data = await model.create(params)
        ctx.body = getSuccessResult({ msg: data === 0 ? "添加失败" : "" })
    }

    // 删除数据
    @post('/users/delete', {
        middlewares: [
            async (ctx: Koa.Context, next: () => Promise<any>) => {
                try {
                    await userSchema.validateAsync(ctx.request.body)
                    await next()
                } catch (e) {
                    ctx.body = getErrorResult(e)
                }
            }
        ]
    })
    public async destroy(ctx: Koa.Context) {
        const { id } = ctx.request.body
        const data = await model.destroy({
            where: {
                id
            }
        })
        ctx.body = getSuccessResult({ msg: data === 0 ? "目标数据不存在" : "" })
    }
}