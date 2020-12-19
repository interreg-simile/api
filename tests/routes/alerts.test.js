/* eslint-disable newline-per-chained-call */
'use strict'

const tap = require('tap')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { sortById, cleanDbData } = require('../utils')
const { version } = require('../../middlewares/loadConfiguration')
const { seed, data: mockData } = require('./__mocks__/alerts.mock')

tap.test('/alerts', async t => {
  await connectTestDb()
  await seed()

  const request = await createMockRequest()

  const baseUrl = `/${version}/alerts`

  t.tearDown(async() => {
    await disconnectTestDb()
  })

  t.test('GET - \'\'', async t => {
    t.test('has success with no query', async t => {
      const expectedData = [
        {
          title: mockData[0].title,
          links: mockData[0].links,
          content: mockData[0].content,
          dateEnd: mockData[0].dateEnd,
          markedForDeletion: mockData[0].markedForDeletion,
        },
        {
          title: mockData[1].title,
          links: mockData[1].links,
          content: mockData[1].content,
          dateEnd: mockData[1].dateEnd,
          markedForDeletion: mockData[1].markedForDeletion,
        },
      ]

      const res = await request.get(baseUrl)

      t.strictSame(res.status, 200)
      t.strictSame(cleanDbData(sortById(res.body.data)), expectedData)
      t.end()
    })
  })
})
