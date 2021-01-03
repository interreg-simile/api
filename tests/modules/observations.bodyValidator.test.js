'use strict'

const tap = require('tap')
const { validationResult } = require('express-validator')
const service = require('../../modules/observations/observations.bodyValidator')

tap.test('observations.bodyValidator', async t => {
  const getErrors = async(chain, req) => {
    await Promise.all(chain.map(validation => validation.run(req)))
    return validationResult(req).errors
  }

  t.test('position validation', async t => {
    t.test('with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'position',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'position.coordinates',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an array of two elements',
          param: 'position.coordinates',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.position, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with lon out of bound', async t => {
      const req = { body: { position: { coordinates: [200, 0] } } }

      const wantedErrors = [
        {
          value: [200, 0],
          msg: 'First value must be between -180 and 180',
          param: 'position.coordinates',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.position, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with lat out of bound', async t => {
      const req = { body: { position: { coordinates: [0, 200] } } }

      const wantedErrors = [
        {
          value: [0, 200],
          msg: 'Second value must be between -90 and 90',
          param: 'position.coordinates',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.position, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          position: {
            type: 'foo',
            coordinates: [0, 0, 'foo'],
            accuracy: -1,
            roi: 'foo',
            area: 'foo',
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'You cannot set this property',
          param: 'position.type',
          location: 'body',
        },
        {
          value: -1,
          msg: 'Must be a positive float',
          param: 'position.accuracy',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a valid Mongo id',
          param: 'position.roi',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'You cannot set this property',
          param: 'position.area',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a float',
          param: 'position.coordinates[2]',
          location: 'body',
        },
        {
          value: [0, 0, 'foo'],
          msg: 'Must be an array of two elements',
          param: 'position.coordinates',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.position, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          position: {
            coordinates: [0, 0],
            accuracy: 0,
            roi: '000000000000000000000001',
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.position, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('weather validation', async t => {
    t.test('with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'weather',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'weather.sky.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 6',
          param: 'weather.sky.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.weather, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          weather: {
            temperature: 'foo',
            sky: { code: 7 },
            wind: 'foo',
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a float',
          param: 'weather.temperature',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a float',
          param: 'weather.wind',
          location: 'body',
        },
        {
          value: 7,
          msg: 'Must be an integer between 1 and 6',
          param: 'weather.sky.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.weather, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          weather: {
            temperature: -1,
            sky: { code: 1 },
            wind: 2,
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.weather, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('algae validation', async t => {
    t.test('without codes', async t => {
      const req = {
        body: {
          details: {
            algae: {
              extension: {},
              look: {},
              colour: {},
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.algae.extension.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.algae.extension.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.algae.look.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 4',
          param: 'details.algae.look.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.algae.colour.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 5',
          param: 'details.algae.colour.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.algae, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          details: {
            algae: {
              checked: 'foo',
              extension: { code: 10 },
              look: { code: 10 },
              colour: { code: 10 },
              iridescent: 'foo',
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.algae.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.algae.iridescent',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.algae.extension.code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 4',
          param: 'details.algae.look.code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 5',
          param: 'details.algae.colour.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.algae, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          details: {
            algae: {
              checked: true,
              extension: { code: 1 },
              look: { code: 1 },
              colour: { code: 1 },
              iridescent: true,
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.algae, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.algae, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without algae field', async t => {
      const req = { body: { details: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.algae, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty algae field', async t => {
      const req = { body: { details: { algae: {} } } }

      const wantedErrors = []

      const errors = await getErrors(service.algae, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('foams validation', async t => {
    t.test('without codes', async t => {
      const req = {
        body: {
          details: {
            foams: {
              extension: {},
              look: {},
              height: {},
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.foams.extension.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.foams.extension.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.foams.look.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.foams.look.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.foams.height.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.foams.height.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.foams, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          details: {
            foams: {
              checked: 'foo',
              extension: { code: 10 },
              look: { code: 10 },
              height: { code: 10 },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.foams.checked',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.foams.extension.code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.foams.look.code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.foams.height.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.foams, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          details: {
            foams: {
              checked: true,
              extension: { code: 1 },
              look: { code: 1 },
              height: { code: 1 },
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.foams, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.foams, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without foams field', async t => {
      const req = { body: { details: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.foams, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty foams field', async t => {
      const req = { body: { details: { foams: {} } } }

      const wantedErrors = []

      const errors = await getErrors(service.foams, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('oils validation', async t => {
    t.test('without codes', async t => {
      const req = {
        body: {
          details: {
            oils: {
              extension: {},
              type: {},
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.oils.extension.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.oils.extension.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.oils.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 2',
          param: 'details.oils.type.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.oils, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          details: {
            oils: {
              checked: 'foo',
              extension: { code: 10 },
              type: { code: 10 },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.oils.checked',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.oils.extension.code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 2',
          param: 'details.oils.type.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.oils, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          details: {
            oils: {
              checked: true,
              extension: { code: 1 },
              type: { code: 1 },
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.oils, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.oils, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without oils field', async t => {
      const req = { body: { details: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.oils, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty oils field', async t => {
      const req = { body: { details: { oils: {} } } }

      const wantedErrors = []

      const errors = await getErrors(service.oils, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('litters validation', async t => {
    t.test('without codes', async t => {
      const req = {
        body: {
          details: {
            litters: {
              quantity: {},
              type: [],
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: [],
          msg: 'Must be an array with at least one element',
          param: 'details.litters.type',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.litters.quantity.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.litters.quantity.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.litters, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          details: {
            litters: {
              checked: 'foo',
              quantity: { code: 11 },
              type: [{ code: 11 }],
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.litters.checked',
          location: 'body',
        },
        {
          value: 11,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.litters.quantity.code',
          location: 'body',
        },
        {
          value: 11,
          msg: 'Must be an integer between 1 and 10',
          param: 'details.litters.type[0].code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.litters, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          details: {
            litters: {
              checked: true,
              quantity: { code: 1 },
              type: [{ code: 1 }, { code: 2 }],
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.litters, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.litters, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without litters field', async t => {
      const req = { body: { details: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.litters, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty litters field', async t => {
      const req = { body: { details: { litters: {} } } }

      const wantedErrors = []

      const errors = await getErrors(service.litters, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('odours validation', async t => {
    t.test('without codes', async t => {
      const req = {
        body: {
          details: {
            odours: {
              intensity: {},
              origin: [],
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: [],
          msg: 'Must be an array with at least one element',
          param: 'details.odours.origin',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.odours.intensity.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.odours.intensity.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.odours, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          details: {
            odours: {
              checked: 'foo',
              intensity: { code: 11 },
              origin: [{ code: 11 }],
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.odours.checked',
          location: 'body',
        },
        {
          value: 11,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.odours.intensity.code',
          location: 'body',
        },
        {
          value: 11,
          msg: 'Must be an integer between 1 and 6',
          param: 'details.odours.origin[0].code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.odours, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          details: {
            odours: {
              checked: true,
              intensity: { code: 1 },
              origin: [{ code: 1 }, { code: 2 }],
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.odours, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.odours, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without odours field', async t => {
      const req = { body: { details: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.odours, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty odours field', async t => {
      const req = { body: { details: { odours: {} } } }

      const wantedErrors = []

      const errors = await getErrors(service.odours, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('outlets validation', async t => {
    t.test('without codes', async t => {
      const req = {
        body: {
          details: {
            outlets: {
              terminal: {},
              colour: {},
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.outlets.terminal.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 2',
          param: 'details.outlets.terminal.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'details.outlets.colour.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 7',
          param: 'details.outlets.colour.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.outlets, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          details: {
            outlets: {
              checked: 'foo',
              inPlace: 'foo',
              terminal: { code: 10 },
              colour: { code: 10 },
              vapour: 'foo',
              signage: 'foo',
              signagePhoto: 'foo',
              prodActNearby: 'foo',
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.outlets.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.outlets.inPlace',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.outlets.vapour',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.outlets.signage',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'You cannot set this property',
          param: 'details.outlets.signagePhoto',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.outlets.prodActNearby',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 2',
          param: 'details.outlets.terminal.code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 7',
          param: 'details.outlets.colour.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.outlets, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          details: {
            outlets: {
              checked: true,
              inPlace: true,
              terminal: { code: 1 },
              colour: { code: 1 },
              vapour: true,
              signage: true,
              prodActNearby: true,
              prodActNearbyDetails: 'foo',
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.outlets, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.outlets, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without outlets field', async t => {
      const req = { body: { details: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.outlets, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty outlets field', async t => {
      const req = { body: { details: { outlets: {} } } }

      const wantedErrors = []

      const errors = await getErrors(service.outlets, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('fauna validation', async t => {
    t.test('without codes', async t => {
      const req = {
        body: {
          details: {
            fauna: {
              fish: { alien: { species: [] } },
              birds: { alien: { species: [] } },
              molluscs: { alien: { species: [] } },
              crustaceans: { alien: { species: [] } },
              turtles: { alien: { species: [] } },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: [],
          msg: 'Must be an array with at least one element',
          param: 'details.fauna.fish.alien.species',
          location: 'body',
        },
        {
          value: [],
          msg: 'Must be an array with at least one element',
          param: 'details.fauna.birds.alien.species',
          location: 'body',
        },
        {
          value: [],
          msg: 'Must be an array with at least one element',
          param: 'details.fauna.molluscs.alien.species',
          location: 'body',
        },
        {
          value: [],
          msg: 'Must be an array with at least one element',
          param: 'details.fauna.crustaceans.alien.species',
          location: 'body',
        },
        {
          value: [],
          msg: 'Must be an array with at least one element',
          param: 'details.fauna.turtles.alien.species',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.fauna, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          details: {
            fauna: {
              checked: 'foo',
              fish: {
                checked: 'foo',
                number: 1,
                deceased: 'foo',
                abnormal: { checked: 'foo', details: 'foo' },
                alien: { checked: 'foo', species: [{ code: 10 }] },
              },
              birds: {
                checked: 'foo',
                number: 1,
                deceased: 'foo',
                abnormal: { checked: 'foo', details: 'foo' },
                alien: { checked: 'foo', species: [{ code: 10 }] },
              },
              molluscs: {
                checked: 'foo',
                number: 1,
                deceased: 'foo',
                abnormal: { checked: 'foo', details: 'foo' },
                alien: { checked: 'foo', species: [{ code: 10 }] },
              },
              crustaceans: {
                checked: 'foo',
                number: 1,
                deceased: 'foo',
                abnormal: { checked: 'foo', details: 'foo' },
                alien: { checked: 'foo', species: [{ code: 10 }] },
              },
              turtles: {
                checked: 'foo',
                number: 1,
                deceased: 'foo',
                abnormal: { checked: 'foo', details: 'foo' },
                alien: { checked: 'foo', species: [{ code: 10 }] },
              },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.fish.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.fish.deceased',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.fish.abnormal.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.fish.alien.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.birds.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.birds.deceased',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.birds.abnormal.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.birds.alien.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.molluscs.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.molluscs.deceased',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.molluscs.abnormal.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.molluscs.alien.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.crustaceans.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.crustaceans.deceased',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.crustaceans.abnormal.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.crustaceans.alien.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.turtles.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.turtles.deceased',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.turtles.abnormal.checked',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'details.fauna.turtles.alien.checked',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 1',
          param: 'details.fauna.fish.alien.species[0].code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 2',
          param: 'details.fauna.birds.alien.species[0].code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.fauna.molluscs.alien.species[0].code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 3',
          param: 'details.fauna.crustaceans.alien.species[0].code',
          location: 'body',
        },
        {
          value: 10,
          msg: 'Must be an integer between 1 and 1',
          param: 'details.fauna.turtles.alien.species[0].code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.fauna, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          details: {
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
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.fauna, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.fauna, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without fauna field', async t => {
      const req = { body: { details: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.fauna, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty fauna field', async t => {
      const req = { body: { details: { fauna: {} } } }

      const wantedErrors = []

      const errors = await getErrors(service.fauna, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('transparency validation', async t => {
    t.test('with empty property', async t => {
      const req = { body: { measures: { transparency: {} } } }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.transparency.instrument',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.transparency.val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a number',
          param: 'measures.transparency.val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.transparency.instrument.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.transparency.instrument.type.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.transparency, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          measures: {
            transparency: {
              val: 'foo',
              instrument: {
                type: { code: 3 },
                precision: 'foo',
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.transparency.instrument.precision',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.transparency.val',
          location: 'body',
        },
        {
          value: 3,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.transparency.instrument.type.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.transparency, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.transparency, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without transparency field', async t => {
      const req = { body: { measures: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.transparency, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          measures: {
            transparency: {
              val: 1,
              instrument: {
                type: { code: 1 },
                precision: 1,
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.transparency, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('temperature validation', async t => {
    t.test('with empty property', async t => {
      const req = { body: { measures: { temperature: {} } } }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.temperature.instrument',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.temperature.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a boolean',
          param: 'measures.temperature.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.temperature.instrument.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.temperature.instrument.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.temperature.val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an array',
          param: 'measures.temperature.val',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.temperature, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          measures: {
            temperature: {
              multiple: 'foo',
              val: [{ depth: 'foo', val: 'foo' }, { depth: 1 }, { val: 1 }],
              instrument: {
                type: { code: 3 },
                precision: 'foo',
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.temperature.instrument.precision',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'measures.temperature.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.temperature.val[2].depth',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.temperature.val[0].depth',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a number',
          param: 'measures.temperature.val[2].depth',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.temperature.val[1].val',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.temperature.val[0].val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a number',
          param: 'measures.temperature.val[1].val',
          location: 'body',
        },
        {
          value: 3,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.temperature.instrument.type.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.temperature, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.temperature, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without temperature field', async t => {
      const req = { body: { measures: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.temperature, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          measures: {
            temperature: {
              multiple: true,
              val: [{ depth: 1, val: 1 }],
              instrument: {
                type: { code: 1 },
                precision: 1,
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.transparency, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('ph validation', async t => {
    t.test('with empty property', async t => {
      const req = { body: { measures: { ph: {} } } }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.ph.instrument',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.ph.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a boolean',
          param: 'measures.ph.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.ph.instrument.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.ph.instrument.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.ph.val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an array',
          param: 'measures.ph.val',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.ph, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          measures: {
            ph: {
              multiple: 'foo',
              val: [{ depth: 'foo', val: 'foo' }, { depth: 1 }, { val: 1 }],
              instrument: {
                type: { code: 3 },
                precision: 'foo',
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.ph.instrument.precision',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'measures.ph.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.ph.val[2].depth',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.ph.val[0].depth',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a number',
          param: 'measures.ph.val[2].depth',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.ph.val[1].val',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.ph.val[0].val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a number',
          param: 'measures.ph.val[1].val',
          location: 'body',
        },
        {
          value: 3,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.ph.instrument.type.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.ph, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.ph, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without ph field', async t => {
      const req = { body: { measures: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.ph, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          measures: {
            ph: {
              multiple: true,
              val: [{ depth: 1, val: 1 }],
              instrument: {
                type: { code: 1 },
                precision: 1,
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.transparency, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('oxygen validation', async t => {
    t.test('with empty property', async t => {
      const req = { body: { measures: { oxygen: {} } } }

      const wantedErrors = [
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.oxygen.instrument',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.oxygen.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a boolean',
          param: 'measures.oxygen.multiple',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.oxygen.percentage',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a boolean',
          param: 'measures.oxygen.percentage',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.oxygen.instrument.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.oxygen.instrument.type.code',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.oxygen.val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be an array',
          param: 'measures.oxygen.val',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.oxygen, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('with errors', async t => {
      const req = {
        body: {
          measures: {
            oxygen: {
              multiple: 'foo',
              percentage: 'foo',
              val: [{ depth: 'foo', val: 'foo' }, { depth: 1 }, { val: 1 }],
              instrument: {
                type: { code: 3 },
                precision: 'foo',
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.oxygen.instrument.precision',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'measures.oxygen.multiple',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a boolean',
          param: 'measures.oxygen.percentage',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.oxygen.val[2].depth',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.oxygen.val[0].depth',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a number',
          param: 'measures.oxygen.val[2].depth',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must have a value',
          param: 'measures.oxygen.val[1].val',
          location: 'body',
        },
        {
          value: 'foo',
          msg: 'Must be a number',
          param: 'measures.oxygen.val[0].val',
          location: 'body',
        },
        {
          value: undefined,
          msg: 'Must be a number',
          param: 'measures.oxygen.val[1].val',
          location: 'body',
        },
        {
          value: 3,
          msg: 'Must be an integer between 1 and 2',
          param: 'measures.oxygen.instrument.type.code',
          location: 'body',
        },
      ]

      const errors = await getErrors(service.oxygen, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with empty body', async t => {
      const req = { body: {} }

      const wantedErrors = []

      const errors = await getErrors(service.oxygen, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without oxygen field', async t => {
      const req = { body: { measures: {} } }

      const wantedErrors = []

      const errors = await getErrors(service.oxygen, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success', async t => {
      const req = {
        body: {
          measures: {
            oxygen: {
              multiple: true,
              percentage: true,
              val: [{ depth: 1, val: 1 }],
              instrument: {
                type: { code: 1 },
                precision: 1,
                details: 'foo',
              },
            },
          },
        },
      }

      const wantedErrors = []

      const errors = await getErrors(service.oxygen, req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.end()
})
