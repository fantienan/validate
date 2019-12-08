# Valiadte-end-demo
- @hapi/joi校验接口参数
- 基于TypeScript
- 装饰器

## Install
- yarn install
- install dependencies:

```
yarn install
yarn start
```

## Sample
    - 添加数据模型 约定校验模型

        ```js
        import { Table, Column, Model, DataType } from 'sequelize-typescript';
        // 表名
        @Table({ modelName: 'users' })
        export default class User extends Model<User> {
            @Column({
                primaryKey: true,
                autoIncrement: true,
                type: DataType.UUID,
            })
            public id: number;

            @Column(DataType.CHAR)
            public name: string;
        }
        ```
    - 约定校验模型

        ```js
        import * as Joi from '@hapi/joi'

        export const userSchema: Joi.object = Joi.object({
            id: Joi.number().required(),
            name: Joi.string()
        })
        ```
    - 路由声明及参数校验

        ```js
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
        ```

## 开发计划
【✔️】抽离传参错误时的处理逻辑（未完成）
【✔️】用装饰器实现校验逻辑（为完成）