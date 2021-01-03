'use strict'

const tap = require('tap')
const sinon = require('sinon')
const fetch = require('node-fetch')

const { mockLogger } = require('../utils')
const service = require('../../modules/misc/misc.service')

tap.test('misc.service', async t => {
  t.test('getWeather', async t => {
    const getResponse = skyCode => Promise.resolve({
      ok: true,
      json: () => ({
        weather: [{ id: skyCode }],
        main: { temp: 10 },
        wind: { speed: 10 },
      }),
    })

    const getResult = () => service.getWeather([], mockLogger)

    const getExpectedData = skyCode => ({ sky: skyCode, temperature: 10, wind: 10 })

    const fetchStub = sinon.stub(fetch, 'Promise')

    fetchStub.returns(getResponse(100))
    let result = await getResult()
    t.strictSame(result, getExpectedData(1))

    fetchStub.returns(getResponse(250))
    result = await getResult()
    t.strictSame(result, getExpectedData(4))

    fetchStub.returns(getResponse(650))
    result = await getResult()
    t.strictSame(result, getExpectedData(5))

    fetchStub.returns(getResponse(750))
    result = await getResult()
    t.strictSame(result, getExpectedData(6))

    fetchStub.returns(getResponse(801))
    result = await getResult()
    t.strictSame(result, getExpectedData(2))

    fetchStub.returns(getResponse(850))
    result = await getResult()
    t.strictSame(result, getExpectedData(3))

    fetchStub.restore()
    t.end()
  })

  t.end()
})
