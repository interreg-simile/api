/* eslint-disable newline-per-chained-call */
'use strict'

const { query, body } = require('express-validator')
const bodyValidations = require('./observations.bodyValidator')
const { generalConfiguration } = require('../../lib/loadConfigurations')
const commonValidations = require('../../lib/commonValidations')

const queryCrs = query('crs')
  .optional()
  .isInt({
    min: Math.min(...Object.keys(generalConfiguration.crs).map(crsCode => parseInt(crsCode))),
    max: Math.max(...Object.keys(generalConfiguration.crs).map(crsCode => parseInt(crsCode))),
    allow_leading_zeroes: false,
  }).withMessage('Must be a valid CRS code')

const queryMode = query('mode')
  .optional()
  .isIn(['json', 'geojson']).withMessage('Must be one of \'json\', \'geojson\'')

const getAll = [
  query('minimalRes').optional().isBoolean().withMessage('Must be a boolean'),
  query('excludeOutOfRois').optional().isBoolean().withMessage('Must be a boolean'),
  queryCrs,
  queryMode,
]

const getById = [
  commonValidations.paramId,
  queryCrs,
  queryMode,
]

const create = [
  query('minimalRes').optional().isBoolean().withMessage('Must be a boolean'),
  query('generateCallId').optional().isBoolean().withMessage('Must be a boolean'),

  body('uid').isEmpty().withMessage('You cannot set this property'),
  body('callId').isEmpty().withMessage('You cannot set this property'),
  body('photos').isEmpty().withMessage('You cannot set this property'),

  // ...bodyValidations.position,
  // ...bodyValidations.weather,
  //
  // ...bodyValidations.algae,
  // ...bodyValidations.foams,
  // ...bodyValidations.oils,
  // ...bodyValidations.litters,
  // ...bodyValidations.odours,
  // ...bodyValidations.odours,
  // ...bodyValidations.fauna,
  //
  // ...bodyValidations.transparency,
  // ...bodyValidations.temperature,
  // ...bodyValidations.ph,
  // ...bodyValidations.oxygen,
  // ...bodyValidations.bacteria,

  body('other').optional().trim().escape(),
]

module.exports = { getAll, getById, create }
