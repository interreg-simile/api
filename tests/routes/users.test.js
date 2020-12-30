'use strict'

const tap = require('tap')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { cleanDbData, compareValidationErrorBodies } = require('../utils')
const { version } = require('../../middlewares/loadConfiguration')
const { plainData, seed: seedUsers } = require('./__mocks__/users.mock')
const service = require('../../modules/users/users.service')
const { model: usersModel } = require('../../modules/users/users.model')

tap.test('/users', async t => {
  await connectTestDb('simile-test-users')
  await seedUsers()

  const request = await createMockRequest()

  const baseUrl = `/${version}/users`

  const newEmail = 'test@test.com'
  const newPassword = 'new-password'

  t.tearDown(async() => {
    await disconnectTestDb()
  })

  t.test('GET - /:id', async t => {
    t.test('returns 401 if no authorization header', async t => {
      const { status, body } = await request.get(`${baseUrl}/${plainData[1]._id}`)

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      t.end()
    })

    t.test('returns 401 if paternity is not satisfied', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .get(`${baseUrl}/${plainData[0]._id}`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if :id is wrong format', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'foo', isAdmin: 'false' })

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a valid Mongo id',
          param: 'id',
          location: 'params',
        },
      ]

      const { status, body } = await request
        .get(`${baseUrl}/foo`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 404 if user is not found', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: '000000000000000000000004', isAdmin: 'false' })

      const { status, body } = await request
        .get(`${baseUrl}/000000000000000000000004`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })
      const serviceStub = sinon.stub(service, 'getById').throws(new Error('Something wrong'))

      const { status, body } = await request
        .get(`${baseUrl}/${plainData[1]._id}`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      jwtStub.restore()
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const expectedData = {
        email: plainData[1].email,
        name: plainData[1].name,
        surname: plainData[1].surname,
        city: plainData[1].city,
        yearOfBirth: plainData[1].yearOfBirth,
        gender: plainData[1].gender,
      }

      const { status, body } = await request
        .get(`${baseUrl}/${plainData[1]._id}`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(body.data), expectedData)
      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.test('PATCH - /:id/change-email', async t => {
    t.test('returns 401 if no authorization header', async t => {
      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-email`)
        .send({})

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      t.end()
    })

    t.test('returns 401 if paternity is not satisfied', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[0]._id}/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if :id is wrong format', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'foo', isAdmin: 'false' })

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a valid Mongo id',
          param: 'id',
          location: 'params',
        },
      ]

      const { status, body } = await request
        .patch(`${baseUrl}/foo/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({ email: 'test@test.com' })

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if body is empty', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

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

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if email is wrong format', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be an email',
          param: 'email',
          location: 'body',
        },
      ]

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({ email: 'foo' })

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 404 if user is not found', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: '000000000000000000000004', isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/000000000000000000000004/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({ email: 'test@test.com' })

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 409 if email is already in use', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({ email: 'not-verified@example.com' })

      t.strictSame(status, 409)
      t.strictSame(body, { meta: { code: 409, errorMessage: 'Email already in use', errorType: 'ConflictException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 500 if db operation fails', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })
      const serviceStub = sinon.stub(service, 'changeEmail').throws(new Error('Something wrong'))

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({ email: 'test@test.com' })

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      jwtStub.restore()
      serviceStub.restore()
      t.end()
    })

    t.test('returns 204', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-email`)
        .set('Authorization', 'Bearer foo')
        .send({ email: newEmail })

      t.strictSame(status, 204)
      t.strictSame(body.data, undefined)

      const { email: foundEmail } = await usersModel.findById(plainData[1]._id)
      t.strictSame(foundEmail, newEmail)
      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.test('PATCH - /:id/change-password', async t => {
    t.test('returns 401 if no authorization header', async t => {
      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-password`)
        .send({})

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      t.end()
    })

    t.test('returns 401 if paternity is not satisfied', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[0]._id}/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if :id is wrong format', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'foo', isAdmin: 'false' })

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a valid Mongo id',
          param: 'id',
          location: 'params',
        },
      ]

      const { status, body } = await request
        .patch(`${baseUrl}/foo/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({ oldPassword: 'foo', password: '12345678', confirmPassword: '12345678' })

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if body is empty', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const expectedErrors = [
        {
          value: '',
          msg: 'Must have a value',
          param: 'oldPassword',
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
      ]

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if body contains errors', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const expectedErrors = [
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
      ]

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({ oldPassword: 'foo', password: 'foo', confirmPassword: 'bar' })

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 404 if user is not found', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: '000000000000000000000004', isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/000000000000000000000004/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({ oldPassword: 'foo', password: '12345678', confirmPassword: '12345678' })

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 401 if oldPassword is wrong', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({ oldPassword: 'wrong-password', password: '12345678', confirmPassword: '12345678' })

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'Invalid credentials', errorType: 'NotAuthorizedException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 500 if db operation fails', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })
      const serviceStub = sinon.stub(service, 'changePassword').throws(new Error('Something wrong'))

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({ oldPassword: '12345678', password: '12345678', confirmPassword: '12345678' })

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      jwtStub.restore()
      serviceStub.restore()
      t.end()
    })

    t.test('returns 204', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })
      const jwtStubSign = sinon.stub(jwt, 'sign').returns('token')

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-password`)
        .set('Authorization', 'Bearer foo')
        .send({ oldPassword: '12345678', password: newPassword, confirmPassword: newPassword })

      t.strictSame(status, 204)
      t.strictSame(body.data, undefined)

      const { status: loginStatus } = await request
        .post(`/${version}/auth/login`)
        .send({ email: newEmail, password: newPassword })

      t.strictSame(loginStatus, 200)
      jwtStub.restore()
      jwtStubSign.restore()
      t.end()
    })

    t.end()
  })

  t.test('PATCH - /:id/change-info', async t => {
    t.test('returns 401 if no authorization header', async t => {
      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-info`)
        .send({})

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      t.end()
    })

    t.test('returns 401 if paternity is not satisfied', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[0]._id}/change-info`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if :id is wrong format', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'foo', isAdmin: 'false' })

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a valid Mongo id',
          param: 'id',
          location: 'params',
        },
      ]

      const { status, body } = await request
        .patch(`${baseUrl}/foo/change-info`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if body contains errors', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const expectedErrors = [
        {
          value: 1900,
          msg: 'Must be an integer between 1920 and 2020',
          param: 'yearOfBirth',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be one of \'male\', \'female\', \'other\'',
          param: 'gender',
          location: 'body',
        },
      ]

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-info`)
        .set('Authorization', 'Bearer foo')
        .send({
          name: ' ',
          surname: 'foo bar',
          city: 'foo',
          yearOfBirth: 1900,
          gender: 'foo',
        })

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 404 if user is not found', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: '000000000000000000000004', isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/000000000000000000000004/change-info`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 500 if db operation fails', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })
      const serviceStub = sinon.stub(service, 'changeInfo').throws(new Error('Something wrong'))

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-info`)
        .set('Authorization', 'Bearer foo')
        .send({})

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      jwtStub.restore()
      serviceStub.restore()
      t.end()
    })

    t.test('returns 204 with no data', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[1]._id}/change-info`)
        .set('Authorization', 'Bearer foo')
        .send({ name: ' ', surname: '' })

      t.strictSame(status, 204)
      t.strictSame(body.data, undefined)

      const user = await usersModel.findById(plainData[1]._id)
      t.strictSame(user.name, plainData[1].name)
      t.strictSame(user.surname, plainData[1].surname)
      t.strictSame(user.city, undefined)
      t.strictSame(user.yearOfBirth, undefined)
      t.strictSame(user.gender, undefined)

      jwtStub.restore()
      t.end()
    })

    t.test('returns 204 with data', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[2]._id, isAdmin: 'false' })

      const reqBody = {
        name: 'Test',
        surname: 'Test',
        city: 'Test',
        yearOfBirth: 2000,
        gender: 'male',
      }

      const { status, body } = await request
        .patch(`${baseUrl}/${plainData[2]._id}/change-info`)
        .set('Authorization', 'Bearer foo')
        .send(reqBody)

      t.strictSame(status, 204)
      t.strictSame(body.data, undefined)

      const user = await usersModel.findById(plainData[2]._id)
      t.strictSame(user.name, reqBody.name)
      t.strictSame(user.surname, reqBody.surname)
      t.strictSame(user.city, reqBody.city)
      t.strictSame(user.yearOfBirth, reqBody.yearOfBirth)
      t.strictSame(user.gender, reqBody.gender)

      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.test('DELETE - /:id', async t => {
    t.test('returns 401 if no authorization header', async t => {
      const { status, body } = await request.delete(`${baseUrl}/${plainData[1]._id}`)

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      t.end()
    })

    t.test('returns 401 if paternity is not satisfied', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .delete(`${baseUrl}/${plainData[0]._id}`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 401)
      t.strictSame(body, { meta: { code: 401, errorMessage: 'You are not authorized to perform this action', errorType: 'NotAuthorizedException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if :id is wrong format', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'foo', isAdmin: 'false' })

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a valid Mongo id',
          param: 'id',
          location: 'params',
        },
      ]

      const { status, body } = await request
        .delete(`${baseUrl}/foo`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 404 if user is not found', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: '000000000000000000000004', isAdmin: 'false' })

      const { status, body } = await request
        .delete(`${baseUrl}/000000000000000000000004`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      jwtStub.restore()
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })
      const serviceStub = sinon.stub(service, 'deleteById').throws(new Error('Something wrong'))

      const { status, body } = await request
        .delete(`${baseUrl}/${plainData[1]._id}`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      jwtStub.restore()
      serviceStub.restore()
      t.end()
    })

    t.test('returns 204', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: plainData[1]._id, isAdmin: 'false' })

      const { status, body } = await request
        .delete(`${baseUrl}/${plainData[1]._id}`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 204)
      t.strictSame(body.data, undefined)

      const user = await usersModel.findById(plainData[1]._id)
      t.strictSame(user, null)
      jwtStub.restore()
      t.end()
    })
    t.end()
  })

  t.end()
})
