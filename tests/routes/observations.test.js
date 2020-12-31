'use strict'

const tap = require('tap')
const sinon = require('sinon')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { sortById, cleanDbData, compareValidationErrorBodies } = require('../utils')
const { version } = require('../../lib/loadConfigurations')
const { seed: seedObservations, data: mockObservations } = require('./__mocks__/observations.mock')
const service = require('../../modules/observations/observations.service')

tap.test('/observations', async t => {
  await connectTestDb('simile-test-observations')
  await seedObservations()

  const request = await createMockRequest()

  const baseUrl = `/${version}/observations`

  t.tearDown(async() => {
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

  t.end()
})
