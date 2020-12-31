'use strict'

const { errorTypes, errorMessages } = require('../lib/CustomError')

module.exports = (req, res, next) => {
  const { id: requestedId } = req.params
  const { userId: callerId } = req

  if (requestedId === callerId) {
    return next()
  }

  req.log.error({ requestedId, callerId }, 'Caller does not have the rights to access the resource')

  const statusCode = 401
  const meta = {
    code: statusCode,
    errorMessage: errorMessages[statusCode],
    errorType: errorTypes[statusCode],
  }

  res
    .status(statusCode)
    .json({ meta })
}
