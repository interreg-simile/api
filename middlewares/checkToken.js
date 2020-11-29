'use strict'

const jwt = require('jsonwebtoken')
const constructError = require('../lib/constructError')

const { JWT_PK } = process.env

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    const { token_required: isTokenRequired } = req.config

    if (isTokenRequired) {
      next(constructError(401))
      return
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
    next(constructError(500, 'messages.jwtMalformed'))
    return
  }

  req.userId = decodedToken.userId
  req.isAdmin = decodedToken.isAdmin === 'true'

  next()
}
