import * as Joi from '@hapi/joi'

export const userSchema: Joi.object = Joi.object({
    id: Joi.number().required(),
    name: Joi.string()
})

export const userAddSchema: Joi.object = Joi.object({
    name: Joi.string()
})

export const headerSchema: Joi.object = Joi.object({
    token: Joi.string().required()
})