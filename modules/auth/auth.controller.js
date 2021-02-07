'use strict'

const qs = require('querystring')
const { validationResult } = require('express-validator')
const nanoid = require('nanoid')

const authService = require('./auth.service')
const usersService = require('../users/users.service')
const { CustomError } = require('../../lib/CustomError')
const { version } = require('../../lib/loadConfigurations')

const { API_URL } = process.env

async function register(req, res, next) {
  const { body } = req

  let user
  try {
    const data = { ...body, emailConfirmationToken: authService.generateConfirmationToken() }
    user = await authService.register(data)
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
    await authService.sendConfirmationEmail(user.email, confirmationUrl, req.t)
  } catch (error) {
    req.log.error({ error, user }, 'Error sending confirmation email')
  } finally {
    res.status(201).json({ meta: { code: 201 }, data: { email: user.email } })
  }
}

async function sendConfirmationEmail(req, res, next) {
  const { email } = req.body

  let user
  try {
    user = await usersService.getOneByQuery({ email }, {}, {})
  } catch (error) {
    req.log.error({ error, email }, 'Error finding user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }

  if (user.isConfirmed) {
    req.log.error({ user }, 'User already confirmed')
    return next(new CustomError(409, 'User already confirmed', 'ConflictException'))
  }

  let updatedUser
  try {
    const newToken = authService.generateConfirmationToken()
    updatedUser = await authService.updateConfirmationToken(user, newToken)
  } catch (error) {
    req.log.error({ error, email }, 'Error updating user confirmation token')
    return next(new CustomError(500, error.message))
  }

  try {
    const query = {
      email,
      token: updatedUser.emailConfirmationToken.token,
    }
    const confirmationUrl = `${API_URL}/${version}/auth/confirm-email?${qs.stringify(query)}`
    await authService.sendConfirmationEmail(email, confirmationUrl, req.t)
    res.status(200).json({ meta: { code: 200 }, data: { email } })
  } catch (error) {
    req.log.error({ error, updatedUser }, 'Error sending confirmation email')
    return next(new CustomError(500, error.message))
  }
}

async function confirmEmail(req, res) {
  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    req.log.error({ validationErrors }, 'Validation errors')
    return res.render('confirmEmail', { success: false, errorMessage: req.t('emails:confirmEmail.page.genericError') })
  }

  const { email, token } = req.query

  let user
  try {
    user = await usersService.getOneByQuery({ email }, {}, {})
  } catch (error) {
    req.log.error({ error, email }, 'Error finding user')
    return res.render('confirmEmail', { success: false, errorMessage: req.t('emails:confirmEmail.page.findUserError') })
  }

  if (!authService.isUserTokenValid(user.emailConfirmationToken, token)) {
    req.log.error({ email, token, userToken: user.emailConfirmationToken }, 'Error in user token')
    return res.render('confirmEmail', { success: false, errorMessage: req.t('emails:confirmEmail.page.tokenError') })
  }

  try {
    await authService.confirmEmail(user._id)
  } catch (error) {
    req.log.error({ error, email }, 'Error updating user')
    return res.render('confirmEmail', { success: false, errorMessage: req.t('emails:confirmEmail.page.genericError') })
  }

  return res.render('confirmEmail', { success: true, successMessage: req.t('emails:confirmEmail.page.success') })
}

async function login(req, res, next) {
  const { body } = req

  try {
    const data = await authService.login(body)
    res.status(200).json({ meta: { code: 200 }, data })
  } catch (error) {
    req.log.error({ error, body }, 'Error logging in user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function resetPassword(req, res, next) {
  const { email } = req.body

  let user
  try {
    user = await usersService.getOneByQuery({ email }, {}, {})
  } catch (error) {
    req.log.error({ error, email }, 'Error finding user')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }

  let newPassword
  try {
    newPassword = nanoid.nanoid(10)
    const hashedPassword = await authService.hashPassword(newPassword)
    await authService.updatePassword(user._id, hashedPassword)
  } catch (error) {
    req.log.error({ error, email }, 'Error updating password')
    return next(new CustomError(500, error.message))
  }

  try {
    await authService.sendRestPasswordEmail(email, newPassword, req.t)
    res.status(200).json({ meta: { code: 200 }, data: { email } })
  } catch (error) {
    req.log.error({ error }, 'Error sending reset password email')
    return next(new CustomError(500, error.message))
  }
}

module.exports = { register, login, sendConfirmationEmail, confirmEmail, resetPassword }
