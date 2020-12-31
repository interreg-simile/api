'use strict'

const jwt = require('jsonwebtoken')
const { CustomError } = require('../lib/CustomError')

const { JWT_PK } = process.env

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    req.log.error('JWT token required, but not found')
    throw new CustomError(401)
  }

  const [, token] = authHeader.split(' ')

  let decodedToken
  try {
    decodedToken = jwt.verify(token, JWT_PK)
  } catch (error) {
    req.log.error(error, 'Error decoding JWT token')
    throw new CustomError(500, 'Error decoding JWT token')
  }

  req.userId = decodedToken.userId

  next()
}
