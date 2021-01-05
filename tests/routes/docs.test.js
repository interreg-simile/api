'use strict'

const path = require('path')
const tap = require('tap')
const sinon = require('sinon')

const { version } = require('../../lib/loadConfigurations')
const { createMockRequest } = require('../setup')

tap.test('/docs', async t => {
  const mockDocsPath = path.join(__dirname, '__mocks__', 'docs.mock.html')
  const pathStub = sinon.stub(path, 'join').returns(mockDocsPath)

  const request = await createMockRequest()

  const { res } = await request.get(`/${version}/docs`)

  t.strictSame(
    res.text,
    '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Docs Mock</title>\n</head>\n<body>\n<h1>Test</h1>\n</body>\n</html>\n'
  )
  pathStub.restore()
  t.end()
})
