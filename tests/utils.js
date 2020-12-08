'use strict'

const { errorTypes, errorMessages } = require('../lib/CustomError')

const mockLogger = {
  error: () => '',
  debug: () => '',
  info: () => '',
}

function cleanFoundBody(body) {
  const { data } = body

  const arrayData = Array.isArray(data) ? data : [data]

  arrayData.forEach(element => {
    delete element._id
    delete element['__v']
    delete element.createdAt
    delete element.updatedAt
  })

  body.data = Array.isArray(data) ? arrayData : arrayData[0]

  return body
}

function compareBodies(foundBody, wantedCode, wantedData, tap) {
  const wantedBody = {
    meta: { code: wantedCode },
    data: wantedData,
  }

  tap.strictSame(cleanFoundBody(foundBody), wantedBody)
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

module.exports = { mockLogger, compareBodies, compareValidationErrorBodies }
