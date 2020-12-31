/* eslint-disable newline-per-chained-call */
'use strict'

const { param, query } = require('express-validator')
const { appConf } = require('../middlewares/loadConfiguration')

const paramId = param('id').isMongoId().withMessage('Must be a valid Mongo id')

const queryIncludePast = query('includePast').optional().isBoolean().withMessage('Must be a boolean')

const querySort = sortableFields => [
  query('sort')
    .optional()
    .custom(value => validateSortQuery(value, sortableFields)),
]

function validateSortQuery(value, sortableFields) {
  if (!sortableFields) {
    throw new Error('Sorting is not supported for this route')
  }

  const processedValues = {}
  for (const sort of value.split(',')) {
    const sortElements = sort.split(':')

    if (!sortableFields.includes(sortElements[0])) {
      throw new Error(`You cannot sort for property ${sortElements[0]}`)
    }

    if (sortElements[1] && !['asc', 'desc'].includes(sortElements[1])) {
      throw new Error('Sorting option can be "asc" or "desc"')
    }

    if (processedValues[sortElements[0]]) {
      throw new Error('Please, specify each sorting property just once')
    }

    processedValues[processedValues[0]] = true
  }

  return true
}

const customLanguageKeys = value => {
  const keys = Object.keys(value)

  if (!keys.includes('it') || !keys.includes('en')) {
    throw new Error('Must contain keys "it" and "en"')
  }

  if (!keys.every(key => appConf.lngs.includes(key))) {
    throw new Error('Must contain only supported language')
  }

  return true
}

module.exports = {
  paramId,
  queryIncludePast,
  querySort,
  customLanguageKeys,
}
