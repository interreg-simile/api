'use strict'

const tap = require('tap')
const { validationResult } = require('express-validator')
const { querySort, customLanguageKeys } = require('../../lib/commonValidations')

tap.test('commonValidations', async t => {
  t.test('querySort', async t => {
    const getErrors = async(req, sortableFields) => {
      await querySort(sortableFields)[0].run(req)
      return validationResult(req).errors
    }

    t.test('fails if no sortableFields are provided', async t => {
      const req = { query: { sort: 'foo' } }

      const wantedErrors = [
        {
          value: 'foo',
          msg: 'Sorting is not supported for this route',
          param: 'sort',
          location: 'query',
        },
      ]

      const errors = await getErrors(req)

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('fails if sorting property is not accepted', async t => {
      const req = { query: { sort: 'bar' } }

      const wantedErrors = [
        {
          value: 'bar',
          msg: 'You cannot sort for property bar',
          param: 'sort',
          location: 'query',
        },
      ]

      const errors = await getErrors(req, ['foo'])

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('fails if sorting option is not "asc" or "desc"', async t => {
      const req = { query: { sort: 'foo:bar' } }

      const wantedErrors = [
        {
          value: 'foo:bar',
          msg: 'Sorting option can be "asc" or "desc"',
          param: 'sort',
          location: 'query',
        },
      ]

      const errors = await getErrors(req, ['foo'])

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('fails if sorting property is specified more than one time', async t => {
      const req = { query: { sort: 'foo:asc,foo:desc' } }

      const wantedErrors = [
        {
          value: 'foo:asc,foo:desc',
          msg: 'Please, specify each sorting property just once',
          param: 'sort',
          location: 'query',
        },
      ]

      const errors = await getErrors(req, ['foo'])

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success without sorting option', async t => {
      const req = { query: { sort: 'foo' } }

      const wantedErrors = []

      const errors = await getErrors(req, ['foo'])

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.test('has success with sorting option', async t => {
      const req = { query: { sort: 'foo:desc' } }

      const wantedErrors = []

      const errors = await getErrors(req, ['foo'])

      t.strictSame(errors, wantedErrors)
      t.end()
    })

    t.end()
  })

  t.test('customLanguageKeys', t => {
    t.test('throws if "it" is missing', async t => {
      try {
        customLanguageKeys({ en: 'foo' })
        t.notOk(true, 'Should have thrown an error')
      } catch (error) {
        t.strictSame(error.message, 'Must contain keys "it" and "en"')
      }
      t.end()
    })

    t.test('throws if "en" is missing', async t => {
      try {
        customLanguageKeys({ it: 'foo' })
        t.notOk(true, 'Should have thrown an error')
      } catch (error) {
        t.strictSame(error.message, 'Must contain keys "it" and "en"')
      }
      t.end()
    })

    t.test('throws if unsupported keys are provided', async t => {
      try {
        customLanguageKeys({ it: 'foo', en: 'foo', fr: 'foo' })
        t.notOk(true, 'Should have thrown an error')
      } catch (error) {
        t.strictSame(error.message, 'Must contain only supported language')
      }
      t.end()
    })

    t.test('has success', async t => {
      t.ok(customLanguageKeys({ it: 'foo', en: 'foo' }))
      t.end()
    })

    t.end()
  })

  t.end()
})
