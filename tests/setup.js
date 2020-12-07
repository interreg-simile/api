'use strict'

const mongoose = require('mongoose')
const supertest = require('supertest')

const { mockLogger } = require('./utils')
const initServer = require('../setup/server')

const testDb = 'SIMILE-test-db'
const testDbUrl = `mongodb://127.0.0.1:27017/${testDb}`

async function createMockRequest() {
  const app = await initServer(mockLogger, 'silent')
  return supertest(app)
}

async function connectTestDb() {
  if (mongoose.connection.name) {
    throw new Error(`Mongoose already connected to db ${mongoose.connection.name}`)
  }

  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(testDbUrl, options)
}

async function disconnectTestDb() {
  if (!mongoose.connection) {
    throw new Error('No active mongoose connection found')
  }

  if (mongoose.connection.name !== testDb) {
    throw new Error(`Mongoose not connected to test db. Connected instead to db ${mongoose.connection.name}`)
  }

  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}

module.exports = { createMockRequest, connectTestDb, disconnectTestDb }
