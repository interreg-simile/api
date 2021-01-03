/* eslint-disable newline-per-chained-call */
'use strict'

const { query } = require('express-validator')

const getWeather = [
  query('lat')
    .not().isEmpty().withMessage('Must have a value')
    .isFloat().withMessage('Must be a float'),
  query('lon')
    .not().isEmpty().withMessage('Must have a value')
    .isFloat().withMessage('Must be a float'),
]

module.exports = { getWeather }
