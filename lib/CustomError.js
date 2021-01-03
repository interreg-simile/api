'use strict'

const errorTypes = {
  400: 'BadRequestException',
  401: 'NotAuthorizedException',
  403: 'ForbiddenException',
  404: 'NotFoundException',
  415: 'UnsupportedMediaTypeException',
  422: 'RequestValidationException',
  500: 'ServerException',
}

const errorMessages = {
  400: 'Bad request',
  401: 'You are not authorized to perform this action',
  403: 'You are not allowed to perform this action',
  404: 'Resource not found',
  415: 'Unsupported media type',
  422: 'The body of the request contains some error',
  500: 'Internal server error',
}

class CustomError extends Error {
  constructor(code, message, type) {
    super()

    this.code = code || 500
    this.message = message || errorMessages[code] || errorMessages[500]
    this.type = type || errorTypes[code] || errorTypes[500]

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = { errorTypes, errorMessages, CustomError }
