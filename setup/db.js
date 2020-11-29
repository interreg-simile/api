'use strict'

const mongoose = require('mongoose')
const logger = require('pino')()

const { MONGO_URL } = process.env

async function connectDb() {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(MONGO_URL, options)

  logger.info(`[setup] Connected to db ${MONGO_URL}`)
}

async function disconnectDb() {
  if (mongoose.connection) {
    await mongoose.connection.close()
    logger.info(`[setup] Disconnected from db ${MONGO_URL}`)
  }
}

module.exports = { connectDb, disconnectDb }
