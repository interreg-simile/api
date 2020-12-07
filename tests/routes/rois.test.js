'use strict'

const tap = require('tap')

const { createMockRequest, connectTestDb, disconnectTestDb } = require('../setup')
const { version } = require('../../middlewares/loadConfiguration')
const seedRois = require('../../modules/rois/rois.seed')

tap.test('/rois', async t => {
  await connectTestDb()
  await seedRois()

  const request = await createMockRequest()

  const baseUrl = `/${version}/rois`

  t.tearDown(async() => {
    await disconnectTestDb()
  })

  t.test('GET - \'\'', async t => {
    const res = await request.get(baseUrl)

    t.strictSame(res.status, 200)
    t.end()
  })

  t.end()
})
