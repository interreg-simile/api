'use strict'

const fs = require('fs').promises
const path = require('path')
const tap = require('tap')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { sortById, cleanDbData, compareValidationErrorBodies } = require('../utils')
const { version } = require('../../lib/loadConfigurations')
const { seed: seedObservations, data: mockObservations } = require('./__mocks__/observations.mock')
const { seed: seedRois } = require('./__mocks__/rois.mock')
const service = require('../../modules/observations/observations.service')

const { UPLOAD_PATH } = process.env

tap.test('/observations', async t => {
  await connectTestDb('simile-test-observations')
  await seedObservations()
  await seedRois()

  const request = await createMockRequest()

  const baseUrl = `/${version}/observations`

  t.tearDown(async() => {
    await removeAllUploadedFiles()
    await disconnectTestDb()
  })

  t.test('GET - /', async t => {
    t.test('returns 422 if query minimalRes is wrong format', async t => {
      const query = { minimalRes: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'minimalRes',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query excludeOutOfRois is wrong format', async t => {
      const query = { excludeOutOfRois: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'excludeOutOfRois',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query crs is wrong value', async t => {
      const query = { crs: '4' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          value: '4',
          msg: 'Must be a valid CRS code',
          param: 'crs',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query mode is wrong value', async t => {
      const query = { mode: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be one of \'json\', \'geojson\'',
          param: 'mode',
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
          uid: mockObservations[0].uid,
          date: mockObservations[0].date,
          callId: mockObservations[0].callId,
          position: { ...mockObservations[0].position, crs: { code: 1, description: 'WGS 84' } },
          weather: { ...mockObservations[0].weather, sky: { code: 1, description: 'Clear sky' } },
          details: {
            algae: {
              checked: true,
              extension: { code: 1, description: '< 5 sq. m' },
              look: { code: 1, description: 'Scattered' },
              colour: { code: 1, description: 'Red' },
              iridescent: true,
            },
            foams: {
              checked: true,
              extension: { code: 1, description: '< 5 sq. m' },
              look: { code: 1, description: 'Scattered' },
              height: { code: 1, description: '< 3 cm' },
            },
            oils: {
              checked: true,
              type: { code: 1, description: 'On surface' },
              extension: { code: 1, description: '< 5 sq. m' },
            },
            litters: {
              checked: true,
              quantity: { code: 1, description: '1' },
              type: [{ code: 1, description: 'Plastic' }, { code: 2, description: 'Glass / Ceramic' }],
            },
            odours: {
              checked: true,
              intensity: { code: 1, description: 'Slight' },
              origin: [{ code: 1, description: 'Fish' }, { code: 2, description: 'Mold' }],
            },
            outlets: {
              checked: true,
              inPlace: false,
              terminal: { code: 1, description: 'Visible' },
              colour: { code: 1, description: 'Red' },
              vapour: true,
              signage: true,
              signagePhoto: 'bar.jpg',
              prodActNearby: true,
              prodActNearbyDetails: 'foo',
            },
            fauna: {
              checked: true,
              fish: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Stone moroko' }] },
              },
              birds: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Egyptian goose' }] },
              },
              molluscs: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Corbicula fluminea' }] },
              },
              crustaceans: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Spinycheek crayfish' }] },
              },
              turtles: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Pond slider' }] },
              },
            },
          },
          measures: {
            transparency: {
              val: 1,
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' } },
            temperature: {
              multiple: true,
              val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
            },
            ph: {
              multiple: true,
              val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
            },
            oxygen: {
              multiple: true,
              percentage: true,
              val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
            },
            bacteria: { escherichiaColi: 1, enterococci: 1 },
          },
          other: mockObservations[0].other,
          photos: mockObservations[0].photos,
        },
        {
          uid: mockObservations[1].uid,
          date: mockObservations[1].date,
          position: { ...mockObservations[1].position, crs: { code: 1, description: 'WGS 84' } },
          weather: { ...mockObservations[1].weather, sky: { code: 1, description: 'Clear sky' } },
          photos: [],
        },
      ]

      const { status, body } = await request.get(`${baseUrl}/`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(sortById(body.data)), expectedData)
      t.end()
    })

    t.test('returns 200 with query', async t => {
      const query = { minimalRes: 'true', excludeOutOfRois: 'true', crs: 2, mode: 'geojson' }

      const expectedData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [1292676.363196913, 4840489.919993431],
            },
            properties: {
              _id: mockObservations[0]._id,
              uid: mockObservations[0].uid,
              date: mockObservations[0].date,
              position: {
                crs: { code: 2, description: 'WGS 84 / UTM zone 32N' },
                roi: mockObservations[0].position.roi,
              },
            },
          },
        ],
      }

      const { status, body } = await request
        .get(`${baseUrl}/`)
        .query(query)

      t.strictSame(status, 200)
      t.strictSame(body.data, expectedData)
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

    t.test('returns 422 if query crs is wrong value', async t => {
      const query = { crs: '4' }

      const { status, body } = await request
        .get(`${baseUrl}/${mockObservations[0]._id}`)
        .query(query)

      const expectedErrors = [
        {
          value: '4',
          msg: 'Must be a valid CRS code',
          param: 'crs',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if query mode is wrong value', async t => {
      const query = { mode: 'foo' }

      const { status, body } = await request
        .get(`${baseUrl}/${mockObservations[0]._id}`)
        .query(query)

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be one of \'json\', \'geojson\'',
          param: 'mode',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 404 if observation is not found', async t => {
      const { status, body } = await request.get(`${baseUrl}/${mockObservations[2]._id}`)

      t.strictSame(status, 404)
      t.strictSame(body, { meta: { code: 404, errorMessage: 'Resource not found', errorType: 'NotFoundException' } })
      t.end()
    })

    t.test('returns 500 if db query fails', async t => {
      const serviceStub = sinon.stub(service, 'getById').throws(new Error('Something wrong'))

      const { status, body } = await request.get(`${baseUrl}/${mockObservations[0]._id}`)

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      serviceStub.restore()
      t.end()
    })

    t.test('returns 200 with no query', async t => {
      const expectedData = {
        uid: mockObservations[0].uid,
        date: mockObservations[0].date,
        callId: mockObservations[0].callId,
        position: { ...mockObservations[0].position, crs: { code: 1, description: 'WGS 84' } },
        weather: { ...mockObservations[0].weather, sky: { code: 1, description: 'Clear sky' } },
        details: {
          algae: {
            checked: true,
            extension: { code: 1, description: '< 5 sq. m' },
            look: { code: 1, description: 'Scattered' },
            colour: { code: 1, description: 'Red' },
            iridescent: true,
          },
          foams: {
            checked: true,
            extension: { code: 1, description: '< 5 sq. m' },
            look: { code: 1, description: 'Scattered' },
            height: { code: 1, description: '< 3 cm' },
          },
          oils: {
            checked: true,
            type: { code: 1, description: 'On surface' },
            extension: { code: 1, description: '< 5 sq. m' },
          },
          litters: {
            checked: true,
            quantity: { code: 1, description: '1' },
            type: [{ code: 1, description: 'Plastic' }, { code: 2, description: 'Glass / Ceramic' }],
          },
          odours: {
            checked: true,
            intensity: { code: 1, description: 'Slight' },
            origin: [{ code: 1, description: 'Fish' }, { code: 2, description: 'Mold' }],
          },
          outlets: {
            checked: true,
            inPlace: false,
            terminal: { code: 1, description: 'Visible' },
            colour: { code: 1, description: 'Red' },
            vapour: true,
            signage: true,
            signagePhoto: 'bar.jpg',
            prodActNearby: true,
            prodActNearbyDetails: 'foo',
          },
          fauna: {
            checked: true,
            fish: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1, description: 'Stone moroko' }] },
            },
            birds: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1, description: 'Egyptian goose' }] },
            },
            molluscs: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1, description: 'Corbicula fluminea' }] },
            },
            crustaceans: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1, description: 'Spinycheek crayfish' }] },
            },
            turtles: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1, description: 'Pond slider' }] },
            },
          },
        },
        measures: {
          transparency: {
            val: 1,
            instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' } },
          temperature: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
          },
          ph: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
          },
          oxygen: {
            multiple: true,
            percentage: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
          },
          bacteria: { escherichiaColi: 1, enterococci: 1 },
        },
        other: mockObservations[0].other,
        photos: mockObservations[0].photos,
      }

      const { status, body } = await request.get(`${baseUrl}/${mockObservations[0]._id}`)

      t.strictSame(status, 200)
      t.strictSame(cleanDbData(body.data), expectedData)
      t.end()
    })

    t.test('returns 200 with query', async t => {
      const query = { crs: 2, mode: 'geojson' }

      const expectedData = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [1292676.363196913, 4840489.919993431],
        },
        properties: {
          uid: mockObservations[0].uid,
          date: mockObservations[0].date,
          callId: mockObservations[0].callId,
          position: {
            type: 'Point',
            crs: { code: 2, description: 'WGS 84 / UTM zone 32N' },
            accuracy: 1,
            roi: '000000000000000000000001',
            area: 1,
          },
          weather: { ...mockObservations[0].weather, sky: { code: 1, description: 'Clear sky' } },
          details: {
            algae: {
              checked: true,
              extension: { code: 1, description: '< 5 sq. m' },
              look: { code: 1, description: 'Scattered' },
              colour: { code: 1, description: 'Red' },
              iridescent: true,
            },
            foams: {
              checked: true,
              extension: { code: 1, description: '< 5 sq. m' },
              look: { code: 1, description: 'Scattered' },
              height: { code: 1, description: '< 3 cm' },
            },
            oils: {
              checked: true,
              type: { code: 1, description: 'On surface' },
              extension: { code: 1, description: '< 5 sq. m' },
            },
            litters: {
              checked: true,
              quantity: { code: 1, description: '1' },
              type: [{ code: 1, description: 'Plastic' }, { code: 2, description: 'Glass / Ceramic' }],
            },
            odours: {
              checked: true,
              intensity: { code: 1, description: 'Slight' },
              origin: [{ code: 1, description: 'Fish' }, { code: 2, description: 'Mold' }],
            },
            outlets: {
              checked: true,
              inPlace: false,
              terminal: { code: 1, description: 'Visible' },
              colour: { code: 1, description: 'Red' },
              vapour: true,
              signage: true,
              signagePhoto: 'bar.jpg',
              prodActNearby: true,
              prodActNearbyDetails: 'foo',
            },
            fauna: {
              checked: true,
              fish: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Stone moroko' }] },
              },
              birds: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Egyptian goose' }] },
              },
              molluscs: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Corbicula fluminea' }] },
              },
              crustaceans: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Spinycheek crayfish' }] },
              },
              turtles: {
                checked: true,
                number: 1,
                deceased: true,
                abnormal: { checked: true, details: 'foo' },
                alien: { checked: true, species: [{ code: 1, description: 'Pond slider' }] },
              },
            },
          },
          measures: {
            transparency: {
              val: 1,
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' } },
            temperature: {
              multiple: true,
              val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
            },
            ph: {
              multiple: true,
              val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
            },
            oxygen: {
              multiple: true,
              percentage: true,
              val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
              instrument: { type: { code: 1, description: 'Professional' }, precision: 1, details: 'foo' },
            },
            bacteria: { escherichiaColi: 1, enterococci: 1 },
          },
          other: mockObservations[0].other,
          photos: mockObservations[0].photos,
        },
      }

      const { status, body } = await request
        .get(`${baseUrl}/${mockObservations[0]._id}`)
        .query(query)

      body.data.properties = cleanDbData(body.data.properties)

      t.strictSame(status, 200)
      t.strictSame(body.data, expectedData)
      t.end()
    })

    t.end()
  })

  t.test('POST - /', async t => {
    t.test('returns 415 if request is not multipart/form-data', async t => {
      const { status, body } = await request
        .post(`${baseUrl}/`)
        .send({ foo: 'bar' })

      t.strictSame(status, 415)
      t.strictSame(body, { meta: { code: 415, errorMessage: 'Request must be multipart/form-data', errorType: 'UnsupportedMediaTypeException' } })
      t.end()
    })

    t.test('returns 422 if query has some errors', async t => {
      const reqBody = {
        position: { coordinates: [9.386683, 45.855060] },
        weather: { sky: { code: 1 } },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .query({ minimalRes: 'foo', generateCallId: 'foo' })
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))

      const expectedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'minimalRes',
          location: 'query',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'generateCallId',
          location: 'query',
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 422 if body has some errors', async t => {
      const reqBody = {
        measures: {
          bacteria: {},
        },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .field('measures', JSON.stringify(reqBody.measures))

      const expectedErrors = [
        {
          msg: 'Must have a value',
          param: 'position',
          location: 'body',
        },
        {
          msg: 'Must have a value',
          param: 'position.coordinates',
          location: 'body',
        },
        {
          msg: 'Must be an array of two elements',
          param: 'position.coordinates',
          location: 'body',
        },
        {
          msg: 'Must have a value',
          param: 'weather',
          location: 'body',
        },
        {
          msg: 'Must have a value',
          param: 'weather.sky.code',
          location: 'body',
        },
        {
          msg: 'Must be an integer between 1 and 6',
          param: 'weather.sky.code',
          location: 'body',
        },
        {
          msg: 'At least one value must be specified',
          param: '_error',
          nestedErrors: [
            {
              msg: 'Must have a value',
              param: 'measures.bacteria.escherichiaColi',
              location: 'body',
            },
            {
              msg: 'Must be a number',
              param: 'measures.bacteria.escherichiaColi',
              location: 'body',
            },
            {
              msg: 'Must have a value',
              param: 'measures.bacteria.enterococci',
              location: 'body',
            },
            {
              msg: 'Must be a number',
              param: 'measures.bacteria.enterococci',
              location: 'body',
            },
          ],
        },
      ]

      t.strictSame(status, 422)
      compareValidationErrorBodies(body, expectedErrors, t)
      t.end()
    })

    t.test('returns 500 if db operation fails', async t => {
      const serviceStub = sinon.stub(service, 'create').throws(new Error('Something wrong'))

      const reqBody = {
        position: { coordinates: [9.386683, 45.855060] },
        weather: { sky: { code: 1 } },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))
        .attach('signage', path.join(__dirname, '/__files__/test.jpg'))

      t.strictSame(status, 500)
      t.strictSame(body, { meta: { code: 500, errorMessage: 'Something wrong', errorType: 'ServerException' } })
      t.strictSame((await fs.readdir(UPLOAD_PATH)).length, 1)
      serviceStub.restore()
      t.end()
    })

    t.test('returns 201 with no query', async t => {
      const mockDate = '2000-01-01T00:00:00.000Z'
      const momentStub = sinon.stub(moment, 'utc').returns(moment(mockDate))

      const reqBody = {
        position: { coordinates: [9.145174026489258, 45.47758654665813], accuracy: 1, roi: '000000000000000000000001' },
        weather: { temperature: 1, sky: { code: 1 }, wind: 1 },
        details: {
          algae: { checked: true, extension: { code: '1' }, look: { code: 1 }, colour: { code: 1 }, iridescent: true },
          foams: { checked: true, extension: { code: 1 }, look: { code: '1' }, height: { code: 1 } },
          oils: { checked: true, type: { code: 1 }, extension: { code: 1 } },
          litters: { checked: true, quantity: { code: '1' }, type: [{ code: '1' }, { code: '2' }] },
          odours: { checked: true, intensity: { code: 1 }, origin: [{ code: 1 }, { code: '2' }] },
          outlets: {
            checked: true,
            inPlace: false,
            terminal: { code: '1' },
            colour: { code: 1 },
            vapour: true,
            signage: true,
            prodActNearby: true,
            prodActNearbyDetails: 'foo',
          },
          fauna: {
            checked: true,
            fish: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: '1' }] },
            },
            birds: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
            molluscs: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
            crustaceans: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
            turtles: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
          },
        },
        measures: {
          transparency: { val: 1, instrument: { type: { code: '1' }, precision: 1, details: 'foo' } },
          temperature: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
          ph: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
          oxygen: {
            multiple: true,
            percentage: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
          bacteria: { escherichiaColi: 1, enterococci: 1 },
        },
        other: 'foo&',
      }

      const expectedData = {
        date: mockDate,
        photos: [],
        markedForDeletion: false,
        position: {
          type: 'Point',
          coordinates: [9.145174026489258, 45.47758654665813],
          accuracy: 1,
          crs: { code: 1 },
          roi: '000000000000000000000001',
          area: 1,
        },
        weather: { temperature: 1, sky: { code: 1 }, wind: 1 },
        details: {
          algae: { checked: true, extension: { code: 1 }, look: { code: 1 }, colour: { code: 1 }, iridescent: true },
          foams: { checked: true, extension: { code: 1 }, look: { code: 1 }, height: { code: 1 } },
          oils: { checked: true, type: { code: 1 }, extension: { code: 1 } },
          litters: { checked: true, quantity: { code: 1 }, type: [{ code: 1 }, { code: 2 }] },
          odours: { checked: true, intensity: { code: 1 }, origin: [{ code: 1 }, { code: 2 }] },
          outlets: {
            checked: true,
            inPlace: false,
            terminal: { code: 1 },
            colour: { code: 1 },
            vapour: true,
            signage: true,
            prodActNearby: true,
            prodActNearbyDetails: 'foo',
          },
          fauna: {
            checked: true,
            fish: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
            birds: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
            molluscs: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
            crustaceans: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
            turtles: {
              checked: true,
              number: 1,
              deceased: true,
              abnormal: { checked: true, details: 'foo' },
              alien: { checked: true, species: [{ code: 1 }] },
            },
          },
        },
        measures: {
          transparency: { val: 1, instrument: { type: { code: 1 }, precision: 1, details: 'foo' } },
          temperature: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
          ph: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
          oxygen: {
            multiple: true,
            percentage: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
          bacteria: { escherichiaColi: 1, enterococci: 1 },
        },
        other: 'foo&amp;',
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))
        .field('details', JSON.stringify(reqBody.details))
        .field('measures', JSON.stringify(reqBody.measures))
        .field('other', JSON.stringify(reqBody.other))

      t.strictSame(status, 201)
      t.strictSame(cleanDbData(body.data), expectedData)

      momentStub.restore()
      t.end()
    })

    t.test('returns 201 with query', async t => {
      const mathStub = sinon.stub(Math, 'random').returns(0.1)

      const reqBody = {
        position: { coordinates: [9.386683, 45.855060] },
        weather: { sky: { code: 1 } },
      }

      const expectedData = {
        callId: 19000,
        position: { coordinates: [9.386683, 45.855060] },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .query({ minimalRes: true, generateCallId: true })
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))

      t.strictSame(status, 201)
      t.strictSame(cleanDbData(body.data), expectedData)
      mathStub.restore()
      t.end()
    })

    t.test('returns 201 with user', async t => {
      const jwtStub = sinon.stub(jwt, 'verify').returns({ userId: '000000000000000000000001' })

      const reqBody = {
        position: { coordinates: [9.386683, 45.855060] },
        weather: { sky: { code: 1 } },
      }

      const expectedData = {
        uid: '000000000000000000000001',
        position: { coordinates: [9.386683, 45.855060] },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .set('Authorization', 'Bearer foo')
        .query({ minimalRes: true })
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))

      t.strictSame(status, 201)
      t.strictSame(cleanDbData(body.data), expectedData)
      jwtStub.restore()
      t.end()
    })

    t.test('returns 201 with found roi and createdAt in data', async t => {
      const reqBody = {
        position: { coordinates: [9.145174026489258, 45.47758654665813] },
        weather: { sky: { code: 1 } },
        createdAt: '2020-12-01T00:00:00.000Z',
      }

      const expectedData = {
        date: reqBody.createdAt,
        photos: [],
        markedForDeletion: false,
        position: {
          type: 'Point',
          coordinates: [9.145174026489258, 45.47758654665813],
          area: 1,
          crs: { code: 1 },
          roi: '000000000000000000000001',
        },
        weather: { sky: { code: 1 } },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))
        .field('createdAt', JSON.stringify(reqBody.createdAt))

      t.strictSame(status, 201)
      t.strictSame(body.data.createdAt, '2020-12-01T00:00:00.000Z')
      t.strictSame(cleanDbData(body.data), expectedData)
      t.end()
    })

    t.test('returns 415 if file type is not supported', async t => {
      const reqBody = {
        position: { coordinates: [9.145174026489258, 45.47758654665813] },
        weather: { sky: { code: 1 } },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))
        .attach('photos', path.join(__dirname, '/__files__/test.txt'))

      const expectedMeta = {
        code: 415,
        errorMessage: 'File test.txt has unsupported type text/plain',
        errorType: 'UnsupportedMediaTypeException',
      }

      t.strictSame(status, 415)
      t.strictSame(body, { meta: expectedMeta })
      t.strictSame((await fs.readdir(UPLOAD_PATH)).length, 1)
      t.end()
    })

    t.test('returns 422 if too many files', async t => {
      const reqBody = {
        position: { coordinates: [9.145174026489258, 45.47758654665813] },
        weather: { sky: { code: 1 } },
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))

      const expectedMeta = {
        code: 422,
        errorMessage: 'Too many files',
        errorType: 'RequestValidationException',
      }

      t.strictSame(status, 422)
      t.strictSame(body, { meta: expectedMeta })
      t.strictSame((await fs.readdir(UPLOAD_PATH)).length, 1)
      t.end()
    })

    t.test('returns 201 with images', async t => {
      const mockDate = '2000-01-01T00:00:00.000Z'
      const momentStub = sinon.stub(moment, 'utc').returns(moment(mockDate))

      const reqBody = {
        position: { coordinates: [9.145174026489258, 45.47758654665813], accuracy: 1, roi: '000000000000000000000001' },
        weather: { temperature: 1, sky: { code: 1 }, wind: 1 },
        details: {
          litters: { checked: true, type: [{ code: '1' }, { code: '2' }] },
          fauna: {
            checked: true,
            fish: { checked: true, number: 1, alien: { checked: true, species: [{ code: '1' }] } },
          },
        },
        measures: {
          temperature: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
        },
        other: 'foo',
      }

      const expectedData = {
        markedForDeletion: false,
        date: mockDate,
        position: {
          type: 'Point',
          coordinates: [9.145174026489258, 45.47758654665813],
          accuracy: 1,
          crs: { code: 1 },
          roi: '000000000000000000000001',
          area: 1,
        },
        weather: { temperature: 1, sky: { code: 1 }, wind: 1 },
        details: {
          litters: { checked: true, type: [{ code: 1 }, { code: 2 }] },
          fauna: {
            checked: true,
            fish: { checked: true, number: 1, alien: { checked: true, species: [{ code: 1 }] } },
          },
        },
        measures: {
          temperature: {
            multiple: true,
            val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
            instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
          },
        },
        other: 'foo',
      }

      const { status, body } = await request
        .post(`${baseUrl}/`)
        .field('position', JSON.stringify(reqBody.position))
        .field('weather', JSON.stringify(reqBody.weather))
        .field('details', JSON.stringify(reqBody.details))
        .field('measures', JSON.stringify(reqBody.measures))
        .field('other', JSON.stringify(reqBody.other))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))
        .attach('photos', path.join(__dirname, '/__files__/test.jpg'))
        .attach('signage', path.join(__dirname, '/__files__/test.jpg'))

      t.strictSame(status, 201)

      t.strictSame((await fs.readdir(UPLOAD_PATH)).length, 4)
      t.strictSame(body.data.photos.length, 2)
      t.match(body.data.photos[0], /uploads\/[A-Za-z0-9_-]*.jpeg/)
      t.match(body.data.photos[1], /uploads\/[A-Za-z0-9_-]*.jpeg/)
      t.match(body.data.details.outlets.signagePhoto, /uploads\/[A-Za-z0-9_-]*.jpeg/)

      delete body.data.photos
      delete body.data.details.outlets
      t.strictSame(cleanDbData(body.data), expectedData)

      momentStub.restore()
      await removeAllUploadedFiles()
      t.end()
    })

    t.end()
  })

  t.end()
})

async function removeAllUploadedFiles() {
  const files = await fs.readdir(UPLOAD_PATH)

  for (const file of files) {
    if (file !== '.gitkeep') {
      await fs.unlink(path.join(UPLOAD_PATH, file))
    }
  }
}
