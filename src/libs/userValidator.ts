import Joi from '@hapi/joi'

const loginSchema = Joi.object({
  username: Joi.string().min(5).max(100).required(),
  password: Joi.string().min(5).max(100).required(),
  newPassword: Joi.string().min(5).max(100).optional(),
})

const changePasswordSchema = Joi.object({
  username: Joi.string().min(5).max(100).required(),
  oldPassword: Joi.string().min(5).max(100).required(),
  newPassword: Joi.string().min(5).max(100).required(),
})

const forgotPasswordSchema = Joi.object({
  username: Joi.string().required(),
  newPassword: Joi.string().optional().min(6).max(50),
  code: Joi.string().when('newPassword', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
})

// For some reason typescript needs this
const errorHandler = (schema: Joi.Schema, obj: any) => {
  try {
    const { value, error } = schema.validate(obj)
    if (error) {
      return { error: { message: error.details[0].message } }
    }
    return value
  } catch (error) {
    console.error(error)
    return { error: { message: 'schema validation failed' } }
  }
}

export const validateLogin = (obj: any) => {
  return errorHandler(loginSchema, obj)
}

export const validateChangePassword = (obj: any) => {
  return errorHandler(changePasswordSchema, obj)
}

export const validateForgotPassword = (obj: any) => {
  return errorHandler(forgotPasswordSchema, obj)
}
