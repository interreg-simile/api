/* eslint-disable newline-per-chained-call */
'use strict'

const commonValidations = require('../../lib/commonValidations')

const getAll = [
  commonValidations.queryIncludePast,
  ...commonValidations.querySort(['createdAt', 'dateEnd']),
]

const getById = commonValidations.paramId

module.exports = { getAll, getById }
