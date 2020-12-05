'use strict'

const { CustomError } = require('../lib/CustomError')

module.exports = (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    next()
    return
  }

  try {
    for (const field in req.body) {
      if ({}.hasOwnProperty.call(req.body, field)) {
        req.body[field] = JSON.parse(req.body[field])
      }
    }
  } catch (error) {
    req.log.error(error, 'Error parsing form-data body')
    throw new CustomError(422)
  }
}
