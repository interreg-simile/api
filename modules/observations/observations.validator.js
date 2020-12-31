/* eslint-disable newline-per-chained-call */
'use strict'

const { query } = require('express-validator')
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

module.exports = { getAll, getById }
