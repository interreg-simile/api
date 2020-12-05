'use strict'

const tap = require('tap')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const { mockLogger } = require('../utils')
const middleware = require('../../middlewares/checkToken')

tap.test('checkToken middleware', t => {
  const mockRes = {}
  const mockNext = sinon.spy()

  const getMockReq = (headers = {}, config = {}) => {
    return {
      headers,
      config,
      get: (header) => headers[header],
      log: mockLogger,
    }
  }

  t.beforeEach(done => {
    mockNext.resetHistory()
    done()
  })

  t.test('without Authorization header', t => {
    t.test('calls next if token is not required', t => {
      const mockReq = getMockReq({}, { token_required: false })

      middleware(mockReq, mockRes, mockNext)

      t.ok(mockNext.calledOnce)
      t.strictSame(mockReq.isAdmin, false)
      t.strictSame(mockReq.userId, null)
      t.end()
    })

    t.test('throws an error if token is required', t => {
      const mockReq = getMockReq({}, { token_required: true })

      try {
        middleware(mockReq, mockRes, mockNext)
        t.notOk(true, 'Should have thrown an error')
      } catch (error) {
        t.strictSame(error.code, 401)
      }

      t.ok(mockNext.notCalled)
      t.end()
    })

    t.end()
  })

  t.test('with Authorization header', t => {
    t.test('throws an error if JWT decoding fails', t => {
      const jwtStub = sinon.stub(jwt, 'verify').throws()

      const mockReq = getMockReq({ Authorization: 'Bearer foo' }, { token_required: true })

      try {
        middleware(mockReq, mockRes, mockNext)
        t.notOk(true, 'Should have thrown an error')
      } catch (error) {
        t.strictSame(error.code, 500)
        t.strictSame(error.message, 'Error decoding JWT token')
      }

      t.ok(jwtStub.calledOnce)
      t.ok(mockNext.notCalled)
      jwtStub.restore()
      t.end()
    })

    t.test('calls next if JWT decoding succeeds with admin user', t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user', isAdmin: 'true' })

      const mockReq = getMockReq({ Authorization: 'Bearer foo' }, { token_required: true })

      middleware(mockReq, mockRes, mockNext)

      t.ok(jwtStub.calledOnce)
      t.strictSame(mockReq.userId, 'user')
      t.strictSame(mockReq.isAdmin, true)
      t.ok(mockNext.calledOnce)
      jwtStub.restore()
      t.end()
    })

    t.test('calls next if JWT decoding succeeds with non-admin user', t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user', isAdmin: 'false' })

      const mockReq = getMockReq({ Authorization: 'Bearer foo' }, { token_required: true })

      middleware(mockReq, mockRes, mockNext)

      t.ok(jwtStub.calledOnce)
      t.strictSame(mockReq.userId, 'user')
      t.strictSame(mockReq.isAdmin, false)
      t.ok(mockNext.calledOnce)
      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.end()
})
