'use strict'

module.exports = (code, msg, type) => {
  const error = new Error()

  error.statusCode = code || 500
  error.message = msg || `messages.${error.statusCode}`
  error.type = type || `types.${error.statusCode}`

  return error
}
