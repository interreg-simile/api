'use strict'

const jwt = require('jsonwebtoken')
const { CustomError } = require('../lib/CustomError')

const { JWT_PK } = process.env

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    const { token_required: isTokenRequired } = req.config

    if (isTokenRequired) {
      req.log.error('KWT token required, but not found')
      throw new CustomError(401)
    }

    req.isAdmin = false
    req.userId = null
    next()
    return
  }

  const [, token] = authHeader.split(' ')

  let decodedToken
  try {
    decodedToken = jwt.verify(token, JWT_PK)
  } catch (error) {
    req.log.error(error, 'Error decoding JWT token')
    throw new CustomError(500, 'Malformed JTW token')
  }

  req.userId = decodedToken.userId
  req.isAdmin = decodedToken.isAdmin === 'true'

  next()
}
