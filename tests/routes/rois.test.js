'use strict'

const tap = require('tap')
const sinon = require('sinon')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { sortById, cleanDbData, compareValidationErrorBodies } = require('../utils')
const { version } = require('../../lib/loadConfigurations')
const { seed } = require('./__mocks__/rois.mock')
const service = require('../../modules/rois/rois.service')

tap.test('/rois', async t => {
  await connectTestDb('simile-test-rois')
  await seed()

  const request = await createMockRequest()

  const baseUrl = `/${version}/rois`

  t.tearDown(async() => {
    await disconnectTestDb()
  })

  t.test('GET - /', async t => {
    t.test('returns 422 if query lat is defined and lon is not', async t => {
      const query = { lat: 0.0 }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          msg: 'Both or neither query parameters lat and lon have to be a valid (float) value',
          param: '_error',
          nestedErrors: [
            {
              value: '0',
              msg: 'Invalid value',
              param: 'lat',
              location: 'query',
            },
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
          ],
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lon is defined and lat is not', async t => {
      const query = { lon: 0.0 }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          msg: 'Both or neither query parameters lat and lon have to be a valid (float) value',
          param: '_error',
          nestedErrors: [
            {
              value: '0',
              msg: 'Invalid value',
              param: 'lon',
              location: 'query',
            },
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
          ],
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lat is wrong format', async t => {
      const query = { lat: 'foo', lon: 0.0 }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          msg: 'Both or neither query parameters lat and lon have to be a valid (float) value',
          param: '_error',
          nestedErrors: [
            {
              value: 'foo',
              msg: 'Invalid value',
              param: 'lat',
              location: 'query',
            },
            {
              value: '0',
              msg: 'Invalid value',
              param: 'lon',
              location: 'query',
            },
            {
              value: 'foo',
              msg: 'Must be a float',
              param: 'lat',
              location: 'query',
            },
          ],
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query lon is wrong format', async t => {
      const query = { lat: 0.0, lon: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          msg: 'Both or neither query parameters lat and lon have to be a valid (float) value',
          param: '_error',
          nestedErrors: [
            {
              value: '0',
              msg: 'Invalid value',
              param: 'lat',
              location: 'query',
            },
            {
              value: 'foo',
              msg: 'Invalid value',
              param: 'lon',
              location: 'query',
            },
            {
              value: 'foo',
              msg: 'Must be a float',
              param: 'lon',
              location: 'query',
            },
          ],
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query includeCoords is wrong format', async t => {
      const query = { includeCoords: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'includeCoords',
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
          country: { code: 1, description: 'Italy' },
          area: { code: 1, description: 'Lombardy Region' },
          lake: { code: 1, description: 'Lake Maggiore' },
        },
        {
          country: { code: 2, description: 'Switzerland' },
          area: { code: 2, description: 'Piedmont Region' },
          lake: { code: 2, description: 'Lake Como' },
        },
        {
          country: { code: 2, description: 'Switzerland' },
          area: { code: 3, description: 'Canton of Ticino' },
          lake: { code: 3, description: 'Lake Lugano' },
        },
      ]

      const { status, body } = await request.get(`${baseUrl}/`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(sortById(body.data)), expectedData)
      t.end()
    })

    t.test('returns 200 with query', async t => {
      const query = {
        includeCoords: true,
        lat: 45.477947646310284,
        lon: 9.14337158203125,
      }

      const expectedData = [
        {
          country: { code: 1, description: 'Italy' },
          area: { code: 1, description: 'Lombardy Region' },
          lake: { code: 1, description: 'Lake Maggiore' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [
                  9.138221740722656,
                  45.48492845141098,
                ],
                [
                  9.127235412597656,
                  45.46639130966522,
                ],
                [
                  9.167747497558594,
                  45.47939202177826,
                ],
                [
                  9.138221740722656,
                  45.48492845141098,
                ],
              ],
            ],
          },
        },
      ]

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(sortById(body.data)), expectedData)
      t.end()
    })

    t.end()
  })

  t.end()
})
