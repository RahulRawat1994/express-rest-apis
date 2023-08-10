import Joi from  'joi'

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().trim().required(),
    password: Joi.string().required().min(6)
  })
}

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email()
  })
}

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    otp: Joi.number().required(),
  })
}

const verifyEmal = {
  params: Joi.object().keys({
    token: Joi.string().required()
  })
}

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmal
}