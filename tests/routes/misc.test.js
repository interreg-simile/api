'use strict'

const tap = require('tap')
const nock = require('nock')
const sinon = require('sinon')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { sortById, cleanDbData, compareValidationErrorBodies } = require('../utils')
const { version } = require('../../lib/loadConfigurations')
const { seed: seedLinks, data: mockLinks } = require('./__mocks__/links.mock')
const { seed: seedContacts, data: mockContacts } = require('./__mocks__/authorityContacts.mock')
const service = require('../../modules/misc/misc.service')

tap.test('/misc', async t => {
  await connectTestDb('simile-test-misc')
  await seedLinks()
  await seedContacts()

  nock.disableNetConnect()
  nock.enableNetConnect('127.0.0.1')

  const request = await createMockRequest()

  const baseUrl = `/${version}/misc`

  t.tearDown(async() => {
    await disconnectTestDb()
    nock.cleanAll()
    nock.enableNetConnect()
  })

  t.test('GET - /weather', async t => {
    t.test('returns 422 if query lat is defined and lon is not', async t => {
      const query = { lat: 0.0 }

      const { status, body } = await request
        .get(`${baseUrl}/weather`)
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

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lon is defined and lat is not', async t => {
      const query = { lon: 0.0 }

      const { status, body } = await request
        .get(`${baseUrl}/weather`)
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

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lat is wrong format', async t => {
      const query = { lat: 'foo', lon: 0.0 }

      const { status, body } = await request
        .get(`${baseUrl}/weather`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a float',
          param: 'lat',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lon is wrong format', async t => {
      const query = { lat: 0.0, lon: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/weather`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a float',
          param: 'lon',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 500 if OWM call fails', async t => {
      const query = { lat: 12.5, lon: 12.5 }

      const owmScope = nock('https://api.openweathermap.org')
        .get('/data/2.5/weather?lat=12.5&lon=12.5&appid=undefined&lang=en&units=metric')
        .replyWithError('Something wrong')

      const { status, body } = await request
        .get(`${baseUrl}/weather`)
        .query(query)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Error calling OpenWeatherMap', errorType: 'ServerException' } })
      t.ok(owmScope.isDone())
      t.end()
    })

    t.test('returns 500 if OWM call is not ok', async t => {
      const query = { lat: 12.5, lon: 12.5 }

      const owmScope = nock('https://api.openweathermap.org')
        .get('/data/2.5/weather?lat=12.5&lon=12.5&appid=undefined&lang=en&units=metric')
        .reply(400, { error: 'error' })

      const { status, body } = await request
        .get(`${baseUrl}/weather`)
        .query(query)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Error calling OpenWeatherMap', errorType: 'ServerException' } })
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

      const { status, body } = await request
        .get(`${baseUrl}/weather`)
        .query(query)

      t.strictSame(status, 200)
      t.strictSame(body.data, { sky: 4, temperature: 10, wind: 10 })
      t.ok(owmScope.isDone())
      t.end()
    })

    t.end()
  })

  t.test('GET - /links', async t => {
    t.test('returns 500 if db query fails', async t => {
      const serviceStub = sinon.stub(service, 'getAllLinks').throws(new Error('Something wrong'))

      const { status, body } = await request.get(`${baseUrl}/links`)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200', async t => {
      const expectedData = [
        {
          link: mockLinks[1].link,
          name: mockLinks[1].name,
          order: mockLinks[1].order,
        },
        {
          link: mockLinks[0].link,
          name: mockLinks[0].name,
          order: mockLinks[0].order,
        },
        {
          link: mockLinks[2].link,
          name: mockLinks[2].name,
          order: mockLinks[2].order,
        },
      ]

      const { status, body } = await request.get(`${baseUrl}/links`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(body.data), expectedData)
      t.end()
    })

    t.end()
  })

  t.test('GET - /authority-contacts', async t => {
    t.test('returns 422 if query area is wrong format', async t => {
      const query = { area: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/authority-contacts`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be an integer between 1 and 3',
          param: 'area',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query area is forbidden value', async t => {
      const query = { area: 10 }

      const { status, body } = await request
        .get(`${baseUrl}/authority-contacts`)
        .query(query)

      const expectedErrors = [
        {
          value: '10',
          msg: 'Must be an integer between 1 and 3',
          param: 'area',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const serviceStub = sinon.stub(service, 'getAllContacts').throws(new Error('Something wrong'))

      const { status, body } = await request.get(`${baseUrl}/authority-contacts`)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200 without query', async t => {
      const expectedData = [
        {
          contact: mockContacts[0].contact,
          type: mockContacts[0].type,
          area: mockContacts[0].area,
          instructions: mockContacts[0].instructions,
        },
        {
          contact: mockContacts[1].contact,
          type: mockContacts[1].type,
          area: mockContacts[1].area,
        },
        {
          contact: mockContacts[2].contact,
          type: mockContacts[2].type,
          area: mockContacts[2].area,
          instructions: mockContacts[2].instructions,
        },
      ]

      const { status, body } = await request.get(`${baseUrl}/authority-contacts`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(sortById(body.data)), expectedData)
      t.end()
    })

    t.test('returns 200 with query', async t => {
      const expectedData = [
        {
          contact: mockContacts[0].contact,
          type: mockContacts[0].type,
          area: mockContacts[0].area,
          instructions: mockContacts[0].instructions,
        },
      ]

      const { status, body } = await request
        .get(`${baseUrl}/authority-contacts`)
        .query({ area: mockContacts[0].area })

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(sortById(body.data)), expectedData)
      t.end()
    })

    t.end()
  })

  t.end()
})
