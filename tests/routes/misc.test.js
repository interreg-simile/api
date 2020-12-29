'use strict'

const tap = require('tap')
const nock = require('nock')

const { createMockRequest } = require('../setup')
const { version } = require('../../middlewares/loadConfiguration')
const { compareValidationErrorBodies } = require('../utils')

tap.test('/misc', async t => {
  nock.disableNetConnect()
  nock.enableNetConnect('127.0.0.1')

  const request = await createMockRequest()

  t.tearDown(async() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  t.test('GET - /weather', async t => {
    const baseUrl = `/${version}/misc/weather`

    t.test('returns 422 if query lat is defined and lon is not', async t => {
      const query = { lat: 0.0 }

      const res = await request
        .get(baseUrl)
        .query(query)

      const expectedErrors = [
        {
          msg: 'Must have a value',
          param: 'lon',
          location: 'query',
        },
        {
          msg: 'Must be a float',
          param: 'lon',
          location: 'query',
        },
      ]

      t.strictSame(res.status, 422)
      compareValidationErrorBodies(res.body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lon is defined and lat is not', async t => {
      const query = { lon: 0.0 }

      const res = await request
        .get(baseUrl)
        .query(query)

      const expectedErrors = [
        {
          msg: 'Must have a value',
          param: 'lat',
          location: 'query',
        },
        {
          msg: 'Must be a float',
          param: 'lat',
          location: 'query',
        },
      ]

      t.strictSame(res.status, 422)
      compareValidationErrorBodies(res.body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lat is wrong format', async t => {
      const query = { lat: 'foo', lon: 0.0 }

      const res = await request
        .get(baseUrl)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a float',
          param: 'lat',
          location: 'query',
        },
      ]

      t.strictSame(res.status, 422)
      compareValidationErrorBodies(res.body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lon is wrong format', async t => {
      const query = { lat: 0.0, lon: 'foo' }

      const res = await request
        .get(baseUrl)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a float',
          param: 'lon',
          location: 'query',
        },
      ]

      t.strictSame(res.status, 422)
      compareValidationErrorBodies(res.body, expectedErrors, t)
      t.end()
    })

    t.test('returns 500 if OWM call fails', async t => {
      const query = { lat: 12.5, lon: 12.5 }

      const owmScope = nock('https://api.openweathermap.org')
        .get('/data/2.5/weather?lat=12.5&lon=12.5&appid=undefined&lang=en&units=metric')
        .replyWithError('Something wrong')

      const res = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(res.status, 500)
      t.strictSame(res.body, { meta: { code: 500, errorMessage: 'Error calling OpenWeatherMap', errorType: 'ServerException' } })
      t.ok(owmScope.isDone())
      t.end()
    })

    t.test('returns 500 if OWM call is not ok', async t => {
      const query = { lat: 12.5, lon: 12.5 }

      const owmScope = nock('https://api.openweathermap.org')
        .get('/data/2.5/weather?lat=12.5&lon=12.5&appid=undefined&lang=en&units=metric')
        .reply(400, { error: 'error' })

      const res = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(res.status, 500)
      t.strictSame(res.body, { meta: { code: 500, errorMessage: 'Error calling OpenWeatherMap', errorType: 'ServerException' } })
      t.ok(owmScope.isDone())
      t.end()
    })

    t.test('returns 200', async t => {
      const query = { lat: 12.5, lon: 12.5 }

      const owmData = {
        weather: [{ id: 200 }],
        main: { temp: 10 },
        wind: { speed: 10 },
      }

      const owmScope = nock('https://api.openweathermap.org')
        .get('/data/2.5/weather?lat=12.5&lon=12.5&appid=undefined&lang=en&units=metric')
        .reply(200, owmData)

      const res = await request
        .get(baseUrl)
        .query(query)

      t.strictSame(res.status, 200)
      t.strictSame(res.body.data, { sky: 4, temperature: 10, wind: 10 })
      t.ok(owmScope.isDone())
      t.end()
    })

    t.end()
  })

  t.end()
})
