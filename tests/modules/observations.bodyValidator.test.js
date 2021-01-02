'use strict'

const tap = require('tap')
// const { validationResult } = require('express-validator')
// const service = require('../../modules/observations/observations.bodyValidator')

tap.test('observations.bodyValidator', async t => {
  // const getErrors = async(chain, req) => {
  //   await Promise.all(service.position.map(validation => validation.run(req)))
  //   return validationResult(req)
  // }

  t.test('position validation', async t => {
    t.test('with empty body', async t => {
      // const req = { body: {} }
      //
      // const wantedErrors = []
      //
      // const errors = await getErrors(service.position, req)
      //
      // t.strictSame(errors, wantedErrors)
      t.end()
    })
  })

  t.end()
})
