'use strict'

const tap = require('tap')
const sinon = require('sinon')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { sortById, cleanDbData, compareValidationErrorBodies } = require('../utils')
const { version } = require('../../lib/loadConfigurations')
const { seed: seedEvents, data: mockEvents } = require('./__mocks__/events.mock')
const service = require('../../modules/events/events.service')

tap.test('/events', async t => {
  await connectTestDb('simile-test-events')
  await seedEvents()

  const request = await createMockRequest()

  const baseUrl = `/${version}/events`

  t.tearDown(async() => {
    await disconnectTestDb()
  })

  t.test('GET - /', async t => {
    t.test('returns 422 if query includePast is wrong format', async t => {
      const query = { includePast: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'includePast',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if sort query is wrong', async t => {
      const query = { sort: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'You cannot sort for property foo',
          param: 'sort',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const serviceStub = sinon.stub(service, 'getAll').throws(new Error('Something wrong'))

      const { status, body } = await request.get(`${baseUrl}/`)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200 with no query', async t => {
      const expectedData = [
        {
          title: mockEvents[0].title,
          description: mockEvents[0].description,
          links: mockEvents[0].links,
          hasDetails: mockEvents[0].hasDetails,
          position: mockEvents[0].position,
          date: mockEvents[0].date,
          contacts: mockEvents[0].contacts,
        },
        {
          title: mockEvents[1].title,
          description: mockEvents[1].description,
          links: mockEvents[1].links,
          hasDetails: mockEvents[1].hasDetails,
          position: mockEvents[1].position,
          date: mockEvents[1].date,
          contacts: mockEvents[1].contacts,
        },
      ]

      const { status, body } = await request.get(`${baseUrl}/`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(sortById(body.data)), expectedData)
      t.end()
    })

    t.test('returns 200 with query', async t => {
      const expectedData = [
        {
          title: mockEvents[1].title,
          description: mockEvents[1].description,
          links: mockEvents[1].links,
          hasDetails: mockEvents[1].hasDetails,
          position: mockEvents[1].position,
          date: mockEvents[1].date,
          contacts: mockEvents[1].contacts,
        },
      ]

      const query = { includePast: 'false' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      t.strictSame(status, 200)
      const sortedData = sortById(body.data)
      t.strictSame(cleanDbData(sortedData), expectedData)
      t.end()
    })

    t.test('returns 200 with sort', async t => {
      const expectedData = [
        {
          title: mockEvents[1].title,
          description: mockEvents[1].description,
          links: mockEvents[1].links,
          hasDetails: mockEvents[1].hasDetails,
          position: mockEvents[1].position,
          date: mockEvents[1].date,
          contacts: mockEvents[1].contacts,
        },
        {
          title: mockEvents[0].title,
          description: mockEvents[0].description,
          links: mockEvents[0].links,
          hasDetails: mockEvents[0].hasDetails,
          position: mockEvents[0].position,
          date: mockEvents[0].date,
          contacts: mockEvents[0].contacts,
        },
      ]

      const query = { sort: 'date:desc' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(body.data), expectedData)
      t.end()
    })

    t.end()
  })

  t.test('GET - /:id', async t => {
    t.test('returns 422 if :id is wrong format', async t => {
      const { status, body } = await request.get(`${baseUrl}/foo`)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a valid Mongo id',
          param: 'id',
          location: 'params',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 404 if event is not found', async t => {
      const { status, body } = await request.get(`${baseUrl}/${mockEvents[2]._id}`)

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const serviceStub = sinon.stub(service, 'getById').throws(new Error('Something wrong'))

      const { status, body } = await request.get(`${baseUrl}/${mockEvents[0]._id}`)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200', async t => {
      const expectedData = {
        title: mockEvents[0].title,
        description: mockEvents[0].description,
        links: mockEvents[0].links,
        hasDetails: mockEvents[0].hasDetails,
        position: mockEvents[0].position,
        date: mockEvents[0].date,
        contacts: mockEvents[0].contacts,
      }

      const { status, body } = await request.get(`${baseUrl}/${mockEvents[0]._id}`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(body.data), expectedData)
      t.end()
    })

    t.end()
  })

  t.end()
})
