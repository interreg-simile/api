'use strict'

const { errorTypes, errorMessages } = require('../lib/CustomError')

const mockLogger = {
  error: () => '',
  debug: () => '',
  info: () => '',
}

function sortById(array) {
  const compare = (objA, objB) => {
    if (objA._id < objB._id) { return -1 }
    if (objA._id > objB._id) { return 1 }
    return 0
  }

  return array.sort(compare)
}

function cleanDbData(data) {
  const arrayData = Array.isArray(data) ? data : [data]

  arrayData.forEach(element => {
    delete element._id
    delete element['__v']
    delete element.createdAt
    delete element.updatedAt
  })

  return Array.isArray(data) ? arrayData : arrayData[0]
}

function compareValidationErrorBodies(foundBody, wantedErrors, tap) {
  const meta = {
    code: 422,
    errorMessage: errorMessages[422],
    errorType: errorTypes[422],
  }

  const wantedBody = {
    meta,
    data: { errors: wantedErrors },
  }

  tap.strictSame(foundBody, wantedBody)
}

module.exports = { mockLogger, sortById, cleanDbData, compareValidationErrorBodies }
