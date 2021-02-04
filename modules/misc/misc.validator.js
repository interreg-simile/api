/* eslint-disable newline-per-chained-call */
'use strict'

const { query } = require('express-validator')

const { modelsConfiguration } = require('../../lib/loadConfigurations')
const { rois: { area: roisAreaConfiguration } } = modelsConfiguration

const getWeather = [
  query('lat')
    .not().isEmpty().withMessage('Must have a value')
    .isFloat().withMessage('Must be a float'),
  query('lon')
    .not().isEmpty().withMessage('Must have a value')
    .isFloat().withMessage('Must be a float'),
]

const getAllContacts = [
  query('area')
    .optional()
    .isInt({
      min: roisAreaConfiguration.min,
      max: roisAreaConfiguration.max,
      allow_leading_zeroes: false,
    }).withMessage(`Must be an integer between ${roisAreaConfiguration.min} and ${roisAreaConfiguration.max}`),
]

module.exports = { getWeather, getAllContacts }
