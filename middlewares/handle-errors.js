/* eslint-disable no-unused-vars */
'use strict'

const { errorTypes, errorMessages } = require('../lib/CustomError')

// TODO remove saved files
function handleErrors(error, req, res, next) {
  const statusCode = error.code || 500

  const meta = {
    code: statusCode,
    errorMessage: error.message || errorMessages[500],
    errorType: error.type || errorTypes[500],
  }

  res.status(statusCode).json({ meta })
}

module.exports = { handleErrors }
