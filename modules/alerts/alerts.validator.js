/* eslint-disable newline-per-chained-call */
'use strict'

const { body } = require('express-validator')
const commonValidations = require('../../lib/commonValidations')

const getAll = [
  commonValidations.queryIncludePast,
  commonValidations.queryIncludeDeletedOnlyIfAdmin,
  commonValidations.querySort,
]

const getById = commonValidations.paramId

const create = [
  body('title')
    .not().isEmpty()
    .custom(value => commonValidations.customLanguageKeys(value)),

  body('links').optional().isArray().withMessage('Must be an array'),
  body('links.*.nameIta').not().isEmpty().trim().escape(),
  body('links.*.nameEng').not().isEmpty().trim().escape(),
  body('links.*.url').not().isEmpty().isURL().withMessage('Must be a valid url'),

  body('content')
    .not().isEmpty()
    .custom(value => commonValidations.customLanguageKeys(value)),

  body('dateEnd')
    .not().isEmpty().isISO8601({ strict: true, strictSeparator: true }).withMessage('Must be a valid date')
    .custom(value => {
      const valueTime = new Date(value).getTime()
      if (valueTime <= new Date().getTime()) {
        throw new Error('Must be a future date')
      }
      return true
    }),

  body('markedForDeletion').isEmpty(),
]

const upsert = commonValidations.paramId

const softDelete = commonValidations.paramId

module.exports = { getAll, getById, create, upsert, softDelete }
