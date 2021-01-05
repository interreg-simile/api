/* eslint-disable no-empty-function */
'use strict'

const tap = require('tap')
const sinon = require('sinon')

const handleErrors = require('../../middlewares/handleErrors')
const { errorTypes, errorMessages } = require('../../lib/CustomError')

tap.test('handleErrors middleware', t => {
  const mockRes = {
    status: () => {},
    json: () => {},
  }
  const mockNext = sinon.spy()

  t.test('without input error', t => {
    const statusStub = sinon.stub(mockRes, 'status').returns(mockRes)
    const jsonStub = sinon.stub(mockRes, 'json').returns(mockRes)

    handleErrors({}, {}, mockRes, mockNext)

    t.ok(statusStub.calledOnceWith(500))
    t.ok(jsonStub.calledOnceWith({ meta: { code: 500, errorMessage: errorMessages[500], errorType: errorTypes[500] } }))
    t.ok(mockNext.notCalled)
    statusStub.restore()
    jsonStub.restore()
    t.end()
  })

  t.end()
})
