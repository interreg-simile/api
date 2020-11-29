'use strict'

const tap = require('tap')
const sinon = require('sinon')

const middleware = require('../../middlewares/checkToken')

tap.test('checkToken middleware', t => {
  const mockRes = {}
  const mockNext = sinon.spy()

  const getMockReq = (headers = {}, config = {}) => {
    return {
      headers,
      config,
      get: (header) => headers[header],
    }
  }

  t.test('without header', t => {
    t.test('calls next if token is not required', t => {
      const mockReq = getMockReq({}, { token_required: false })

      middleware(mockReq, mockRes, mockNext)

      t.ok(mockNext.calledOnce)
      t.end()
    })

    t.end()
  })

  t.end()
})
