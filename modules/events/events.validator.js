'use strict'

const commonValidations = require('../../lib/commonValidations')

const getAll = [
  commonValidations.queryIncludePast,
  ...commonValidations.querySort(['date']),
]

const getById = commonValidations.paramId

module.exports = { getAll, getById }
