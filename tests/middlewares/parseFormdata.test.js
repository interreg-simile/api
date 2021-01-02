'use strict'

const tap = require('tap')
const sinon = require('sinon')

const { mockLogger } = require('../utils')
const parseFormdata = require('../../middlewares/parseFormdata')

tap.test('parseFormdata middleware', t => {
  const mockRes = {}
  const mockNext = sinon.spy()

  t.test('throws an error if no Authorization header is provided', t => {
    const jsonStub = sinon.stub(JSON, 'parse').throws()

    const mockReq = { body: { foo: 'bar' }, log: mockLogger }

    try {
      parseFormdata(mockReq, mockRes, mockNext)
      t.notOk(true, 'Should have thrown an error')
    } catch (error) {
      t.strictSame(error.code, 422)
    }

    t.ok(mockNext.notCalled)
    jsonStub.restore()
    t.end()
  })

  t.end()
})
