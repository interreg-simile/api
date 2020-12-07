'use strict'

const tap = require('tap')
const sinon = require('sinon')
const yaml = require('yamljs')

const { mockLogger } = require('../utils')
const { setRequestConfig: middleware } = require('../../middlewares/loadConfiguration')

tap.test('loadConfiguration middleware', t => {
  const mockRes = {}
  const mockNext = sinon.spy()

  const config = {
    '/foo': [{
      path: '/bar',
      method: 'GET',
      foo: 'bar',
    }],
  }
  const yamlStub = sinon.stub(yaml, 'load').returns(config)

  const getMockReq = (path, method) => {
    return {
      path,
      method,
      log: mockLogger,
    }
  }

  t.beforeEach(done => {
    mockNext.resetHistory()
    yamlStub.resetHistory()
    done()
  })

  t.tearDown(() => yamlStub.restore)

  t.test('throws an error if the route is not found', t => {
    const mockReq = getMockReq('/v1/foo/not-found', 'GET')

    try {
      middleware(mockReq, mockRes, mockNext)
      t.notOk(true, 'Should have thrown an error')
    } catch (error) {
      t.strictSame(error.code, 404)
      t.strictSame(error.message, 'Route not found')
    }

    t.ok(yamlStub.calledOnce)
    t.ok(mockNext.notCalled)
    t.end()
  })

  t.test('sets the correct configuration', t => {
    const mockReq = getMockReq('/v1/foo/bar', 'GET')

    middleware(mockReq, mockRes, mockNext)

    t.ok(yamlStub.calledOnce)
    t.ok(mockNext.calledOnce)
    t.strictSame(mockReq.config, config['/foo'][0])
    t.end()
  })

  t.end()
})
