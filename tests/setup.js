'use strict'

const mongoose = require('mongoose')
const supertest = require('supertest')

const { mockLogger } = require('./utils')
const initServer = require('../setup/server')

async function createMockRequest() {
  const app = await initServer(mockLogger, 'silent')
  return supertest(app)
}

async function connectTestDb(dbName) {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(`mongodb://127.0.0.1:27888/${dbName}`, options)
}

async function disconnectTestDb() {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}

module.exports = { createMockRequest, connectTestDb, disconnectTestDb }
