'use strict'

const tap = require('tap')
const sinon = require('sinon')

const { mockLogger } = require('../utils')
const loadConfiguration = require('../../middlewares/loadConfiguration')
const middleware = require('../../middlewares/setLanguage')

tap.test('setLanguage middleware', t => {
  const spyResSet = sinon.spy()
  const mockRes = {
    set: spyResSet,
  }

  const mockNext = sinon.spy()

  const loadConfigurationStub = sinon.stub(loadConfiguration, 'appConf').value({
    defaultLng: 'en',
    lngs: ['en', 'it'],
  })

  const getMockReq = (headers = {}) => {
    return {
      headers,
      get: (header) => headers[header],
      log: mockLogger,
    }
  }

  t.beforeEach(done => {
    spyResSet.resetHistory()
    mockNext.resetHistory()
    loadConfigurationStub.resetHistory()
    done()
  })

  t.tearDown(() => loadConfigurationStub.restore)

  t.test('sets default language without Accept-Language header', t => {
    const mockReq = getMockReq()

    middleware(mockReq, mockRes, mockNext)

    t.ok(mockNext.calledOnce)
    t.strictSame(mockReq.lng, 'en')
    t.strictSame(typeof mockReq.t, 'function')
    t.ok(spyResSet.calledOnceWithExactly('Content-Language', 'en'))
    t.end()
  })

  t.test('sets default language with Accept-Language header if language not supported', t => {
    const mockReq = getMockReq({ 'Accept-Language': 'ru,fr' })

    middleware(mockReq, mockRes, mockNext)

    t.ok(mockNext.calledOnce)
    t.strictSame(mockReq.lng, 'en')
    t.strictSame(typeof mockReq.t, 'function')
    t.ok(spyResSet.calledOnceWithExactly('Content-Language', 'en'))
    t.end()
  })

  t.test('sets specified language', t => {
    const mockReq = getMockReq({ 'Accept-Language': 'ru,it' })

    middleware(mockReq, mockRes, mockNext)

    t.ok(mockNext.calledOnce)
    t.strictSame(mockReq.lng, 'it')
    t.strictSame(typeof mockReq.t, 'function')
    t.ok(spyResSet.calledOnceWithExactly('Content-Language', 'it'))
    t.end()
  })

  t.end()
})
