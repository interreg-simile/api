'use strict'

const tap = require('tap')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const { mockLogger } = require('../utils')
const { parseRequiredToken, parseOptionalToken } = require('../../middlewares/parseAuthToken')

tap.test('parseAuthToken middleware', t => {
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

  t.test('parseRequiredToken', t => {
    t.beforeEach(done => {
      mockNext.resetHistory()
      done()
    })

    t.test('throws an error if no Authorization header is provided', t => {
      const mockReq = getMockReq({})

      try {
        parseRequiredToken(mockReq, mockRes, mockNext)
        t.notOk(true, 'Should have thrown an error')
      } catch (error) {
        t.strictSame(error.code, 401)
      }

      t.ok(mockNext.notCalled)
      t.end()
    })

    t.test('throws an error if JWT decoding fails', t => {
      const jwtStub = sinon.stub(jwt, 'verify').throws()

      const mockReq = getMockReq({ Authorization: 'Bearer foo' })

      try {
        parseRequiredToken(mockReq, mockRes, mockNext)
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

    t.test('calls next if JWT decoding succeeds', t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user' })

      const mockReq = getMockReq({ Authorization: 'Bearer foo' })

      parseRequiredToken(mockReq, mockRes, mockNext)

      t.ok(jwtStub.calledOnce)
      t.strictSame(mockReq.userId, 'user')
      t.ok(mockNext.calledOnce)
      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.test('parseOptionalToken', t => {
    t.beforeEach(done => {
      mockNext.resetHistory()
      done()
    })

    t.test('calls next without user id if no Authorization header is provided', t => {
      const mockReq = getMockReq({})

      parseOptionalToken(mockReq, mockRes, mockNext)

      t.strictSame(mockReq.userId, undefined)
      t.ok(mockNext.calledOnce)
      t.end()
    })

    t.test('throws an error if JWT decoding fails', t => {
      const jwtStub = sinon.stub(jwt, 'verify').throws()

      const mockReq = getMockReq({ Authorization: 'Bearer foo' })

      try {
        parseOptionalToken(mockReq, mockRes, mockNext)
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

    t.test('calls next with user id if Authorization header is provided', t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user' })

      const mockReq = getMockReq({ Authorization: 'Bearer foo' })

      parseOptionalToken(mockReq, mockRes, mockNext)

      t.ok(jwtStub.calledOnce)
      t.strictSame(mockReq.userId, 'user')
      t.ok(mockNext.calledOnce)
      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.end()
})
