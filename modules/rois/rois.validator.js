/* eslint-disable newline-per-chained-call */
'use strict'

const { query, oneOf } = require('express-validator')

const getAll = [
  oneOf([
    [query('lat').isEmpty(), query('lon').isEmpty()],
    [
      query('lat')
        .not().isEmpty().withMessage('Must have a value')
        .isFloat().withMessage('Must be a float'),
      query('lon')
        .not().isEmpty().withMessage('Must have a value')
        .isFloat().withMessage('Must be a float'),
    ],
  ], 'Both or neither query parameters lat and lon have to be a valid (float) value'),
  query('includeCoords').optional().isBoolean().withMessage('Must be a boolean'),
]

module.exports = { getAll }
