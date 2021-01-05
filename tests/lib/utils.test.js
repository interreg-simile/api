'use strict'

const tap = require('tap')
const { getMongoSortFromQuerySort } = require('../../lib/utils')

tap.test('utils', t => {
  t.test('getMongoSortFromQuerySort', t => {
    const querySort = 'foo,bar:asc,test:disc'
    const result = getMongoSortFromQuerySort(querySort)

    const expectedResult = {
      foo: 1,
      bar: 1,
      test: -1,
    }

    t.strictSame(result, expectedResult)
    t.end()
  })

  t.end()
})
