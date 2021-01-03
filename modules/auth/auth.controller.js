'use strict'

const service = require('./auth.service')
const { CustomError } = require('../../lib/CustomError')

async function register(req, res, next) {
  const { body } = req

  try {
    const user = await service.register(body)
    res.status(201).json({ meta: { code: 201 }, data: { email: user.email } })
  } catch (error) {
    req.log.error({ error, body }, 'Error registering user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function login(req, res, next) {
  const { body } = req

  try {
    const data = await service.login(body)
    res.status(200).json({ meta: { code: 200 }, data })
  } catch (error) {
    req.log.error({ error, body }, 'Error logging in user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

module.exports = { register, login }
