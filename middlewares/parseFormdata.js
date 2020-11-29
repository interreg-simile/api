'use strict'

const constructError = require('../lib/constructError')

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
    return next(constructError(422))
  }
}
