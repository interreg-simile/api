'use strict'

require('dotenv').config()
const express = require('express')
const logger = require('pino')()

const { appConf } = require('./middlewares/loadConfiguration')
const { connectDb, disconnectDb } = require('./setup/db')
const { initMiddlewares } = require('./setup/middlewares')
const { initRoutes } = require('./setup/routes')
const { handleErrors } = require('./middlewares/handle-errors')

async function start() {
  const { port } = appConf

  const app = express()

  await connectDb(logger)
  initMiddlewares(app, logger)
  initRoutes(app, logger)
  app.use(handleErrors)

  const serverProcess = app.listen(port, () => logger.info(`[setup] Server listening on port ${port}`))
  onClose(serverProcess)
}

function onClose(serverProcess) {
  const stopSignals = ['SIGINT', 'SIGTERM']

  for (const signal of stopSignals) {
    process.on(signal, () => {
      serverProcess.close(async() => {
        logger.info(`[setup] Server shut down`)
        await disconnectDb(logger)
        // eslint-disable-next-line no-process-exit
        process.exit(0)
      })
    })
  }
}

start()
  .catch(error => logger.error('[setup] Error starting the server', error))
