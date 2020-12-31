'use strict'

const tap = require('tap')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { compareValidationErrorBodies } = require('../utils')
const { version } = require('../../lib/loadConfigurations')
const { plainPassword, plainData, seed: seedUsers } = require('./__mocks__/users.mock')
const { model: usersModel } = require('../../modules/users/users.model')
const service = require('../../modules/auth/auth.service')

tap.test('auth', async t => {
  await connectTestDb('simile-test-auth')
  await seedUsers()

  const request = await createMockRequest()

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

    t.test('returns 500 if db operation fails', async t => {
      const serviceStub = sinon.stub(service, 'register').throws(new Error('Something wrong'))

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

      const existsUser = await usersModel.exists({ email: reqBody.email })
      t.ok(existsUser)
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
      const serviceStub = sinon.stub(service, 'login').throws(new Error('Something wrong'))

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

  t.end()
})
