'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendGridMail = require('@sendgrid/mail')
const { nanoid } = require('nanoid')
const moment = require('moment')

const { JWT_PK } = process.env
const constants = require('../../lib/constants')
const { model: usersModel } = require('../users/users.model')
const { CustomError } = require('../../lib/CustomError')

async function register(data) {
  if (await usersModel.exists({ email: data.email })) {
    throw new CustomError(409, 'Email already in use', 'ConflictException')
  }

  const hashPassword = await bcrypt.hash(data.password, 12)

  const emailConfirmationToken = {
    token: nanoid(30),
    validUntil: moment.utc().add(constants.confirmEmailTokenDaysValidity, 'd'),
  }

  const user = new usersModel({
    email: data.email,
    password: hashPassword,
    name: data.name,
    surname: data.surname,
    city: data.city,
    yearOfBirth: data.yearOfBirth,
    gender: data.gender,
    emailConfirmationToken,
  })

  return user.save()
}

async function login(data) {
  const user = await usersModel.findOne({ email: data.email })

  if (!user) {
    throw new CustomError(404)
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password)

  if (!passwordMatch) {
    throw new CustomError(401, 'Invalid credentials')
  }

  if (!user.isConfirmed) {
    throw new CustomError(403, 'Email not verified')
  }

  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_PK)

  return { token, userId: user._id.toString() }
}

async function sendConfirmationEmail(recipient, confirmEmailUrl, i18n) {
  const message = {
    to: recipient,
    from: constants.projectEmail,
    templateId: constants.confirmEmailTemplateId,
    dynamicTemplateData: {
      subject: i18n('emails:confirmEmail.subject'),
      heading: i18n('emails:confirmEmail.heading'),
      tagLine: i18n('emails:confirmEmail.tagLine'),
      buttonText: i18n('emails:confirmEmail.buttonText'),
      confirmEmailUrl,
      footer: i18n('emails:confirmEmail.footer'),
    },
  }

  await sendGridMail.send(message)
}

async function confirmEmail() {}

module.exports = { register, login, sendConfirmationEmail, confirmEmail }
