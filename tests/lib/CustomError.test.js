'use strict'

const tap = require('tap')
const { CustomError, errorMessages, errorTypes } = require('../../lib/CustomError')

tap.test('CustomError', t => {
  t.test('without properties', t => {
    const error = new CustomError()

    t.strictSame(error.code, 500)
    t.strictSame(error.message, errorMessages[500])
    t.strictSame(error.type, errorTypes[500])
    t.end()
  })

  t.test('with properties', t => {
    const code = 1
    const message = 'foo'
    const type = 'bar'
    const error = new CustomError(code, message, type)

    t.strictSame(error.code, code)
    t.strictSame(error.message, message)
    t.strictSame(error.type, type)
    t.end()
  })

  t.end()
})
