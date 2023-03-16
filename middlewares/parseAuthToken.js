'use strict'

const jwt = require('jsonwebtoken')
const { CustomError } = require('../lib/CustomError')

const { JWT_PK } = process.env

function parseRequiredToken(req, res, next) {
  const token = getTokenFromHeader(req, true)
  req.userId = getUserIdFromToken(token, req.log)

  next()
}

function parseOptionalToken(req, res, next) {
  const token = getTokenFromHeader(req, false)

  if (token) {
    req.userId = getUserIdFromToken(token, req.log)
  }

  next()
}

function getTokenFromHeader(req, isRequired) {
  const authHeader = req.get('Authorization')

  if (authHeader) {
    const [, token] = authHeader.split(' ')
    return token
  }

  if (isRequired) {
    req.log.error('JWT token required, but not found')
    throw new CustomError(401)
  }

  return null
}

function getUserIdFromToken(token, logger) {
  let decodedToken

  try {
    decodedToken = jwt.verify(token, JWT_PK)
  } catch (error) {
    logger.error({ err: error }, 'Error decoding JWT token')
    throw new CustomError(500, 'Error decoding JWT token')
  }

  return decodedToken.userId
}

module.exports = { parseRequiredToken, parseOptionalToken }
