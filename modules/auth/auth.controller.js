'use strict'

const qs = require('querystring')

const service = require('./auth.service')
const { CustomError } = require('../../lib/CustomError')
const { version } = require('../../lib/loadConfigurations')

const { API_URL } = process.env

async function register(req, res, next) {
  const { body } = req

  let user
  try {
    user = await service.register(body)
  } catch (error) {
    req.log.error({ error, body }, 'Error registering user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }

  try {
    const query = {
      email: user.email,
      token: user.emailConfirmationToken.token,
    }
    const confirmationUrl = `${API_URL}/${version}/auth/confirm-email?${qs.stringify(query)}`
    await service.sendConfirmationEmail(user.email, confirmationUrl, req.t)
  } catch (error) {
    req.log.error({ error, user }, 'Error sending confirmation email')
  } finally {
    res.status(201).json({ meta: { code: 201 }, data: { email: user.email } })
  }
}

async function confirmEmail(req, res) {
  const { email, token } = req.query

  const renderView = options => res.render('confirmEmail', options)

  renderView({ success: true, errorMessage: 'Error!' })
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

module.exports = { register, login, confirmEmail }
