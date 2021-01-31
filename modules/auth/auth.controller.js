'use strict'

const sendGridMail = require('@sendgrid/mail')

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

async function sendTestEmail(req, res, next) {
  const message = {
    to: 'edoardopessina.priv@gmail.com',
    from: 'interreg-simile@polimi.it',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }

  try {
    await sendGridMail.send(message)
    res.status(200).json({ success: true })
  } catch (error) {
    req.log.error({ error }, 'Error sending test email')
    return next(new CustomError(500, error.message))
  }
}

module.exports = { register, login, sendTestEmail }
