'use strict'

const { CustomError } = require('../lib/CustomError')

module.exports = (req, res, next) => {
  try {
    for (const field in req.body) {
      if ({}.hasOwnProperty.call(req.body, field)) {
        req.body[field] = JSON.parse(req.body[field])
      }
    }

    return next()
  } catch (error) {
    req.log.error(error, 'Error parsing form-data body')
    throw new CustomError(422)
  }
}
