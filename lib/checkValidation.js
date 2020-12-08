'use strict'

const { validationResult } = require('express-validator')
const { errorTypes, errorMessages } = require('../lib/CustomError')

module.exports = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    return next()
  }

  const statusCode = 422
  const meta = {
    code: statusCode,
    errorMessage: errorMessages[statusCode],
    errorType: errorTypes[statusCode],
  }

  res
    .status(statusCode)
    .json({
      meta,
      data: { errors: errors.array() },
    })
}
