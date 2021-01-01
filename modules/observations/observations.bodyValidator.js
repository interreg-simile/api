/* eslint-disable newline-per-chained-call */
'use strict'

const { oneOf, body } = require('express-validator')
const { modelsConfiguration } = require('../../lib/loadConfigurations')

const { observations: observationsConfiguration } = modelsConfiguration

const getCodeFieldValidation = (fieldName, min, max, isArray = false, isOptional = true) => {
  const validation = body(`${fieldName}.${isArray ? '*.' : ''}code`)

  if (isOptional) {
    validation.optional()
  }

  return [
    validation
      .not().isEmpty().withMessage('Must have a value')
      .isInt({ min, max, allow_leading_zeroes: false }).withMessage(`Must be an integer between ${min} and ${max}`),
  ]
}


const position = [
  body('position').not().isEmpty().withMessage('Must have a value'),
  body('position.type').isEmpty().withMessage('You cannot set this property'),

  body('position.coordinates')
    .not().isEmpty().withMessage('Must have a value')
    .isArray({ min: 2, max: 2 }).withMessage('Must be an array of two elements')
    .custom(value => {
      if (!value) {
        return true
      }

      if (value[0] < -180.0 || value[0] > 180.0) {
        throw new Error('First value must be between -180 and 180')
      }

      if (value[1] < -90.0 || value[1] > 90.0) {
        throw new Error('Second value must be between -90 and 90')
      }

      return true
    }),
  body('position.coordinates.*')
    .not().isEmpty().withMessage('Must have a value')
    .isFloat().withMessage('Must be a float'),

  body('position.accuracy').optional().isFloat({ min: 0 }).withMessage('Must be a positive float'),
  body('position.roi').optional().isMongoId().withMessage('Must be a valid Mongo id'),
  body('position.area').isEmpty().withMessage('You cannot set this property'),
]

const weather = [
  body('weather').not().isEmpty().withMessage('Must have a value'),
  body('weather.temperature').optional().isFloat().withMessage('Must be a float'),
  ...getCodeFieldValidation(
    'weather.sky',
    observationsConfiguration.weather.sky.min,
    observationsConfiguration.weather.sky.max,
    false,
    false
  ),
  body('weather.wind').optional().isFloat().withMessage('Must be a float'),
]


const algae = []

const foams = []

const oils = []

const litters = []

const odours = []

const outlets = []

const fauna = []


const getMeasureInstrumentValidation = measureName => [
  body(`${measureName}.instrument`)
    .if(body(measureName).exists())
    .not().isEmpty().withMessage('Must have a value'),

  body(`${measureName}.instrument.type.code`)
    .if(body(measureName).exists())
    .not().isEmpty().withMessage('Must have a value')
    .isInt({
      min: observationsConfiguration.measures.instrument.type.min,
      max: observationsConfiguration.measures.instrument.type.max,
      allow_leading_zeroes: false,
    }).withMessage(`Must be an integer between ${observationsConfiguration.measures.instrument.type.min} and ${observationsConfiguration.measures.instrument.type.max}`),

  body(`${measureName}.instrument.precision`).optional().isNumeric().withMessage('Must be a number'),

  body(`${measureName}.instrument.details`).optional().trim().escape(),
]

const transparency = [
  body('measures.transparency.val')
    .if(body('measures.transparency').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isNumeric().withMessage('Must be a number'),

  ...getMeasureInstrumentValidation('measures.transparency'),
]

const temperature = [
  body('measures.temperature.multiple')
    .if(body('measures.temperature').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isBoolean().withMessage('Must be a boolean'),

  body('measures.temperature.val')
    .if(body('measures.temperature').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isArray().withMessage('Must be an array'),

  body('measures.temperature.val.*.depth')
    .if(body('measures.temperature').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isNumeric().withMessage('Must be a number'),

  body('measures.temperature.val.*.val')
    .if(body('measures.temperature').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isNumeric().withMessage('Must be a number'),

  ...getMeasureInstrumentValidation('measures.temperature'),
]

const ph = [
  body('measures.ph.multiple')
    .if(body('measures.ph').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isBoolean().withMessage('Must be a boolean'),

  body('measures.ph.val')
    .if(body('measures.ph').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isArray().withMessage('Must be an array'),

  body('measures.ph.val.*.depth')
    .if(body('measures.ph').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isNumeric().withMessage('Must be a number'),

  body('measures.ph.val.*.val')
    .if(body('measures.ph').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isNumeric().withMessage('Must be a number'),

  ...getMeasureInstrumentValidation('measures.ph'),
]

const oxygen = [
  body('measures.oxygen.multiple')
    .if(body('measures.oxygen').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isBoolean().withMessage('Must be a boolean'),

  body('measures.oxygen.percentage')
    .if(body('measures.oxygen').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isBoolean().withMessage('Must be a boolean'),

  body('measures.oxygen.val')
    .if(body('measures.oxygen').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isArray().withMessage('Must be an array'),

  body('measures.oxygen.val.*.depth')
    .if(body('measures.oxygen').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isNumeric().withMessage('Must be a number'),

  body('measures.oxygen.val.*.val')
    .if(body('measures.oxygen').exists())
    .not().isEmpty().withMessage('Must have a value')
    .isNumeric().withMessage('Must be a number'),

  ...getMeasureInstrumentValidation('measures.oxygen'),
]

const bacteria = [
  oneOf([
    body('measures.bacteria.escherichiaColi')
      .if(body('measures.bacteria').exists())
      .not().isEmpty().withMessage('Must have a value')
      .isNumeric().withMessage('Must be a number'),

    body('measures.bacteria.enterococci')
      .if(body('measures.bacteria').exists())
      .not().isEmpty().withMessage('Must have a value')
      .isNumeric().withMessage('Must be a number'),
  ], 'At least one value must be specified'),
]

module.exports = {
  position,
  weather,
  transparency,
  temperature,
  ph,
  oxygen,
  bacteria,
  algae,
  foams,
  oils,
  litters,
  odours,
  outlets,
  fauna,
}
