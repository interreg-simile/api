'use strict'

const tap = require('tap')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const sendGridMail = require('@sendgrid/mail')
const moment = require('moment')

const constants = require('../../lib/constants')
const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { compareValidationErrorBodies } = require('../utils')
const { version } = require('../../lib/loadConfigurations')
const { plainPassword, plainData, seed: seedUsers } = require('./__mocks__/users.mock')
const { model: usersModel } = require('../../modules/users/users.model')
const authService = require('../../modules/auth/auth.service')
const userService = require('../../modules/users/users.service')

tap.test('auth', async t => {
  await connectTestDb('simile-test-auth')
  await seedUsers()

  const request = await createMockRequest()

  const fakeToken = { token: 'foo', validUntil: '2021-01-01T00:00:00.000Z' }

  t.tearDown(async() => {
    await disconnectTestDb()
  })

  t.test('POST - /register', async t => {
    const baseUrl = `/${version}/auth/register`

    t.test('returns 422 if body is empty', async t => {
      const reqBody = {}

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      const expectedErrors = [
        {
          msg: 'Must have a value',
          param: 'email',
          location: 'body',
        },
        {
          msg: 'Must be an email',
          param: 'email',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must have a value',
          param: 'password',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must be between 8 and 50 characters',
          param: 'password',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must have a value',
          param: 'confirmPassword',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must have a value',
          param: 'name',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must have a value',
          param: 'surname',
          location: 'body',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if body contains errors', async t => {
      const reqBody = {
        email: 'foo',
        password: 'foo',
        confirmPassword: 'bar',
        name: ' ',
        surname: ' ',
        yearOfBirth: 1000,
        gender: 'foo',
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be an email',
          param: 'email',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be between 8 and 50 characters',
          param: 'password',
          location: 'body',
        },
        {
          value: 'bar',
          msg: 'Password confirmation does not match password',
          param: 'confirmPassword',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must have a value',
          param: 'name',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must have a value',
          param: 'surname',
          location: 'body',
        },
        {
          value: 1000,
          msg: 'Must be an integer between 1920 and 2020',
          param: 'yearOfBirth',
          location: 'body',
        },
        {
          value: 'foo',
          msg: "Must be one of 'male', 'female', 'other'",
          param: 'gender',
          location: 'body',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 409 if email is already in use', async t => {
      const reqBody = {
        email: 'user@example.com',
        password: '12345678',
        confirmPassword: '12345678',
        name: 'test',
        surname: 'test',
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 409)
      t.strictSame(body, { meta: { code: 409, errorMessage: 'Email already in use', errorType: 'ConflictException' } })
      t.end()
    })

    t.test('returns 500 if db user saving fails', async t => {
      const serviceStub = sinon.stub(authService, 'register').throws(new Error('Something wrong'))

      const reqBody = {
        email: 'user@example.com',
        password: '12345678',
        confirmPassword: '12345678',
        name: 'test',
        surname: 'test',
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 201', async t => {
      const generateConfirmationTokenStub = sinon.stub(authService, 'generateConfirmationToken').returns(fakeToken)
      const sendgridStub = sinon.stub(sendGridMail, 'send').resolves(true)

      const reqBody = {
        email: 'test@test.com',
        password: '12345678',
        confirmPassword: '12345678',
        name: 'test',
        surname: 'test',
        city: 'test',
        yearOfBirth: 2000,
        gender: 'other',
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 201)
      t.strictSame(body.data, { email: reqBody.email })

      t.ok(generateConfirmationTokenStub.calledOnce)
      t.ok(sendgridStub.calledOnceWith({
        to: reqBody.email,
        from: constants.projectEmail,
        templateId: constants.confirmEmailTemplateId,
        dynamicTemplateData: {
          subject: 'Verify your email',
          heading: 'Thanks for signing up!',
          tagLine: 'Please, verify your email address.',
          buttonText: 'Verify Email Now',
          confirmEmailUrl: 'undefined/v1/auth/confirm-email?email=test%40test.com&token=foo',
          footer: 'Do not respond to this email. If you have received this email by mistake, please delete the message.',
        },
      }))

      const newUser = await usersModel.findOne({ email: reqBody.email }, {}, { lean: true })
      t.ok(newUser)
      t.strictSame(newUser['emailConfirmationToken']['token'], fakeToken.token)
      t.strictSame(new Date(newUser['emailConfirmationToken']['validUntil']).toISOString(), fakeToken.validUntil)

      generateConfirmationTokenStub.restore()
      sendgridStub.restore()
      t.end()
    })

    t.test('returns 201 if sendConfirmationEmail fails', async t => {
      const generateConfirmationTokenStub = sinon.stub(authService, 'generateConfirmationToken').returns(fakeToken)
      const sendgridStub = sinon.stub(sendGridMail, 'send').throws('Error')

      const reqBody = {
        email: 'test2@test.com',
        password: '12345678',
        confirmPassword: '12345678',
        name: 'test',
        surname: 'test',
        city: 'test',
        yearOfBirth: 2000,
        gender: 'other',
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 201)
      t.strictSame(body.data, { email: reqBody.email })

      t.ok(generateConfirmationTokenStub.calledOnce)
      t.ok(sendgridStub.calledOnceWith({
        to: reqBody.email,
        from: constants.projectEmail,
        templateId: constants.confirmEmailTemplateId,
        dynamicTemplateData: {
          subject: 'Verify your email',
          heading: 'Thanks for signing up!',
          tagLine: 'Please, verify your email address.',
          buttonText: 'Verify Email Now',
          confirmEmailUrl: 'undefined/v1/auth/confirm-email?email=test2%40test.com&token=foo',
          footer: 'Do not respond to this email. If you have received this email by mistake, please delete the message.',
        },
      }))

      const newUser = await usersModel.findOne({ email: reqBody.email }, {}, { lean: true })
      t.ok(newUser)
      t.strictSame(newUser['emailConfirmationToken']['token'], fakeToken.token)
      t.strictSame(new Date(newUser['emailConfirmationToken']['validUntil']).toISOString(), fakeToken.validUntil)

      generateConfirmationTokenStub.restore()
      sendgridStub.restore()
      t.end()
    })

    t.end()
  })

  t.test('POST - /login', async t => {
    const token = 'token'

    const baseUrl = `/${version}/auth/login`

    t.test('returns 422 if body is empty', async t => {
      const reqBody = {}

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      const expectedErrors = [
        {
          msg: 'Must have a value',
          param: 'email',
          location: 'body',
        },
        {
          msg: 'Must be an email',
          param: 'email',
          location: 'body',
        },
        {
          value: '',
          msg: 'Must have a value',
          param: 'password',
          location: 'body',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if email is wrong format', async t => {
      const reqBody = {
        email: 'foo',
        password: plainPassword,
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be an email',
          param: 'email',
          location: 'body',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 404 if user not found', async t => {
      const reqBody = {
        email: 'foo@bar.com',
        password: plainPassword,
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      t.end()
    })

    t.test('returns 401 if password is wrong', async t => {
      const reqBody = {
        email: plainData[1].email,
        password: 'foo',
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'Invalid credentials', errorType: 'NotAuthorizedException' } })
      t.end()
    })

    t.test('returns 403 if email is not verified', async t => {
      const reqBody = {
        email: plainData[2].email,
        password: plainPassword,
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 403)
      t.strictSame(body, { meta: { code: 403, errorMessage: 'Email not verified', errorType: 'ForbiddenException' } })
      t.end()
    })

    t.test('returns 500 if db operation fails', async t => {
      const serviceStub = sinon.stub(authService, 'login').throws(new Error('Something wrong'))

      const reqBody = {
        email: plainData[2].email,
        password: plainPassword,
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200', async t => {
      const jwtStub = sinon.stub(jwt, 'sign').returns(token)

      const reqBody = {
        email: plainData[1].email,
        password: plainPassword,
      }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 200)
      t.strictSame(body.data, { token, userId: plainData[1]._id })
      t.ok(jwtStub.calledOnce)
      t.ok(jwtStub.calledWith({ userId: plainData[1]._id, email: plainData[1].email }, undefined))
      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.test('POST - /send-confirmation-email', async t => {
    const baseUrl = `/${version}/auth/send-confirmation-email`

    t.test('returns 422 if body is empty', async t => {
      const reqBody = {}

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      const expectedErrors = [
        {
          msg: 'Must have a value',
          param: 'email',
          location: 'body',
        },
        {
          msg: 'Must be an email',
          param: 'email',
          location: 'body',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if body contains errors', async t => {
      const reqBody = { email: 'foo' }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be an email',
          param: 'email',
          location: 'body',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 404 if user not found', async t => {
      const reqBody = { email: 'foo@bar.com' }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      t.end()
    })

    t.test('returns 500 if getOneByQuery fails', async t => {
      const serviceStub = sinon.stub(userService, 'getOneByQuery').throws(new Error('Something wrong'))

      const reqBody = { email: plainData[2].email }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 409 if user is already confirmed', async t => {
      const reqBody = { email: plainData[0].email }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 409)
      t.strictSame(body, { meta: { code: 409, errorMessage: 'User already confirmed', errorType: 'ConflictException' } })
      t.end()
    })

    t.test('returns 500 if updateConfirmationToken fails', async t => {
      const serviceStub = sinon.stub(authService, 'updateConfirmationToken').throws(new Error('Something wrong'))

      const reqBody = { email: plainData[2].email }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 500 if sendConfirmationEmail fails', async t => {
      const serviceStub = sinon.stub(authService, 'sendConfirmationEmail').throws(new Error('Something wrong'))

      const reqBody = { email: plainData[2].email }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200', async t => {
      const generateConfirmationTokenStub = sinon.stub(authService, 'generateConfirmationToken').returns(fakeToken)
      const sendgridStub = sinon.stub(sendGridMail, 'send').resolves(true)

      const reqBody = { email: plainData[2].email }

      const { status, body } = await request
        .post(baseUrl)
        .send(reqBody)

      t.strictSame(status, 200)
      t.strictSame(body.data, { email: reqBody.email })

      t.ok(generateConfirmationTokenStub.calledOnce)
      t.ok(sendgridStub.calledOnceWith({
        to: reqBody.email,
        from: constants.projectEmail,
        templateId: constants.confirmEmailTemplateId,
        dynamicTemplateData: {
          subject: 'Verify your email',
          heading: 'Thanks for signing up!',
          tagLine: 'Please, verify your email address.',
          buttonText: 'Verify Email Now',
          confirmEmailUrl: 'undefined/v1/auth/confirm-email?email=not-verified%40example.com&token=foo',
          footer: 'Do not respond to this email. If you have received this email by mistake, please delete the message.',
        },
      }))

      const user = await usersModel.findOne({ email: reqBody.email }, {}, { lean: true })
      t.ok(user)
      t.strictSame(user['emailConfirmationToken']['token'], fakeToken.token)
      t.strictSame(new Date(user['emailConfirmationToken']['validUntil']).toISOString(), fakeToken.validUntil)

      generateConfirmationTokenStub.restore()
      sendgridStub.restore()
      t.end()
    })

    t.end()
  })

  t.test('GET - /confirm-email', async t => {
    const baseUrl = `/${version}/auth/confirm-email`

    t.test('sends an error if query email is missing', async t => {
      const query = { token: 'foo' }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Oops! Something went wrong.'))
      t.end()
    })

    t.test('sends an error if query email is wrong format', async t => {
      const query = { email: 'foo', token: 'foo' }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Oops! Something went wrong.'))
      t.end()
    })

    t.test('sends an error if query token is missing', async t => {
      const query = { email: 'test@test.com' }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Oops! Something went wrong.'))
      t.end()
    })

    t.test('sends an error if getOneByQuery fails', async t => {
      const serviceStub = sinon.stub(userService, 'getOneByQuery').throws(new Error('Something wrong'))

      const query = { email: 'test@test.com', token: 'foo' }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('User not found!'))
      t.ok(serviceStub.calledOnceWith({ email: query.email }, {}, {}))

      serviceStub.restore()
      t.end()
    })

    t.test('sends an error if user does not have the token', async t => {
      const serviceStub = sinon.stub(userService, 'getOneByQuery').returns({ name: 'foo' })

      const query = { email: 'test@test.com', token: 'foo' }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Token is invalid or expired!'))
      t.ok(serviceStub.calledOnceWith({ email: query.email }, {}, {}))

      serviceStub.restore()
      t.end()
    })

    t.test('sends an error if tokens mismatch', async t => {
      const serviceStub = sinon
        .stub(userService, 'getOneByQuery')
        .returns({ emailConfirmationToken: { token: 'bar', validUntil: 'date' } })

      const query = { email: 'test@test.com', token: 'foo' }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Token is invalid or expired!'))
      t.ok(serviceStub.calledOnceWith({ email: query.email }, {}, {}))

      serviceStub.restore()
      t.end()
    })

    t.test('sends an error if token is no longer valid', async t => {
      const serviceStub = sinon
        .stub(userService, 'getOneByQuery')
        .returns({ emailConfirmationToken: { token: 'foo', validUntil: moment.utc().subtract(1, 'd') } })

      const query = { email: 'test@test.com', token: 'foo' }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Token is invalid or expired!'))
      t.ok(serviceStub.calledOnceWith({ email: query.email }, {}, {}))

      serviceStub.restore()
      t.end()
    })

    t.test('sends an error if confirmEmail fails', async t => {
      const serviceStub = sinon.stub(authService, 'confirmEmail').throws(new Error('Something wrong'))

      const query = { email: plainData[3].email, token: plainData[3].emailConfirmationToken.token }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Oops! Something went wrong.'))
      t.ok(serviceStub.calledOnce)
      t.strictSame(serviceStub.args[0].toString(), plainData[3]._id)

      serviceStub.restore()
      t.end()
    })

    t.test('has success', async t => {
      const query = { email: plainData[3].email, token: plainData[3].emailConfirmationToken.token }

      const { status, text } = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(status, 200)
      t.ok(text.includes('Email successfully confirmed!'))

      const updatedUser = await usersModel.findOne({ email: plainData[3].email }, {}, { lean: true })
      t.ok(updatedUser)
      t.strictSame(updatedUser['isConfirmed'], true)
      t.notOk(updatedUser['emailConfirmationToken'])

      t.end()
    })

    t.end()
  })

  t.end()
})
