'use strict'

const tap = require('tap')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { sortById, cleanDbData, compareValidationErrorBodies } = require('../utils')
const { version } = require('../../middlewares/loadConfiguration')
const { seed: seedAlerts, data: mockAlerts } = require('./__mocks__/alerts.mock')
const service = require('../../modules/alerts/alerts.service')

tap.test('/alerts', async t => {
  await connectTestDb('simile-test-alerts')
  await seedAlerts()

  const request = await createMockRequest()

  const baseUrl = `/${version}/alerts`

  t.tearDown(async() => {
    await disconnectTestDb()
  })

  t.test('GET - \'\'', async t => {
    t.test('returns 422 if query includePast is wrong format', async t => {
      const query = { includePast: 'foo' }

      const { status, body } = await request
        .get(baseUrl)
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

    t.test('returns 422 if query includeDeleted is wrong format', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user', isAdmin: 'true' })

      const query = { includeDeleted: 'foo' }

      const { status, body } = await request
        .get(baseUrl)
        .set('Authorization', 'Bearer foo')
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'includeDeleted',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 422 if query includeDeleted is true and user is not admin', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user', isAdmin: 'false' })

      const query = { includeDeleted: 'true' }

      const { status, body } = await request
        .get(baseUrl)
        .set('Authorization', 'Bearer foo')
        .query(query)

      const expectedErrors = [
        {
          value: 'true',
          msg: 'Can be set to true only by an admin user',
          param: 'includeDeleted',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const serviceStub = sinon.stub(service, 'getAll').throws(new Error('Something wrong'))

      const { status, body } = await request.get(baseUrl)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200 with no query', async t => {
      const expectedData = [
        {
          title: mockAlerts[0].title,
          links: mockAlerts[0].links,
          content: mockAlerts[0].content,
          dateEnd: mockAlerts[0].dateEnd,
          markedForDeletion: mockAlerts[0].markedForDeletion,
        },
        {
          title: mockAlerts[1].title,
          links: mockAlerts[1].links,
          content: mockAlerts[1].content,
          dateEnd: mockAlerts[1].dateEnd,
          markedForDeletion: mockAlerts[1].markedForDeletion,
        },
      ]

      const { status, body } = await request.get(baseUrl)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(sortById(body.data)), expectedData)
      t.end()
    })

    t.test('returns 200 with query', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user', isAdmin: 'true' })

      const expectedData = [
        {
          uid: mockAlerts[1].uid,
          title: mockAlerts[1].title,
          links: mockAlerts[1].links,
          content: mockAlerts[1].content,
          dateEnd: mockAlerts[1].dateEnd,
          markedForDeletion: mockAlerts[1].markedForDeletion,
        },
        {
          uid: mockAlerts[2].uid,
          title: mockAlerts[2].title,
          links: mockAlerts[2].links,
          content: mockAlerts[2].content,
          dateEnd: mockAlerts[2].dateEnd,
          markedForDeletion: mockAlerts[2].markedForDeletion,
        },
      ]

      const query = { includeDeleted: 'true', includePast: 'false' }

      const { status, body } = await request
        .get(baseUrl)
        .set('Authorization', 'Bearer foo')
        .query(query)

      t.strictSame(status, 200)
      const sortedData = sortById(body.data)
      t.strictSame(cleanDbData(sortedData), expectedData)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 200 with sort', async t => {
      const expectedData = [
        {
          title: mockAlerts[1].title,
          links: mockAlerts[1].links,
          content: mockAlerts[1].content,
          dateEnd: mockAlerts[1].dateEnd,
          markedForDeletion: mockAlerts[1].markedForDeletion,
        },
        {
          title: mockAlerts[0].title,
          links: mockAlerts[0].links,
          content: mockAlerts[0].content,
          dateEnd: mockAlerts[0].dateEnd,
          markedForDeletion: mockAlerts[0].markedForDeletion,
        },
      ]

      const query = { sort: 'dateEnd:desc' }

      const { status, body } = await request
        .get(baseUrl)
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

    t.test('returns 404 if alert is not found', async t => {
      const { status, body } = await request.get(`${baseUrl}/222222222222222222222223`)

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      t.end()
    })

    t.test('returns 404 if non-admin user searches a deleted alert', async t => {
      const { status, body } = await request.get(`${baseUrl}/${mockAlerts[2]._id}`)

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const serviceStub = sinon.stub(service, 'getById').throws(new Error('Something wrong'))

      const { status, body } = await request.get(`${baseUrl}/${mockAlerts[0]._id}`)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200 with non-admin user', async t => {
      const expectedData = {
        title: mockAlerts[0].title,
        links: mockAlerts[0].links,
        content: mockAlerts[0].content,
        dateEnd: mockAlerts[0].dateEnd,
        markedForDeletion: mockAlerts[0].markedForDeletion,
      }

      const { status, body } = await request.get(`${baseUrl}/${mockAlerts[0]._id}`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(body.data), expectedData)
      t.end()
    })

    t.test('returns 200 with admin user', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: 'user', isAdmin: 'true' })

      const expectedData = {
        uid: mockAlerts[2].uid,
        title: mockAlerts[2].title,
        links: mockAlerts[2].links,
        content: mockAlerts[2].content,
        dateEnd: mockAlerts[2].dateEnd,
        markedForDeletion: mockAlerts[2].markedForDeletion,
      }

      const { status, body } = await request
        .get(`${baseUrl}/${mockAlerts[2]._id}`)
        .set('Authorization', 'Bearer foo')

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(body.data), expectedData)
      jwtStub.restore()
      t.end()
    })

    t.end()
  })

  t.end()
})
