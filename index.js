'use strict'

require('dotenv').config()
const pino = require('pino')

const initServer = require('./setup/server')
const { appConf } = require('./lib/loadConfigurations')
const { connectDb, disconnectDb } = require('./setup/db')

const { LOG_LEVEL } = process.env
const logger = pino({ level: LOG_LEVEL })

async function start() {
  const { port } = appConf

  const app = await initServer(logger, LOG_LEVEL)

  await connectDb(logger)

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

start().catch(error => logger.error(error, '[setup] Error starting the server'))
