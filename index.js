'use strict'

require('dotenv').config()
const pino = require('pino')
const initServer = require('./setup/server')
const { connectDb, disconnectDb } = require('./setup/db')
const { initTransporter } = require('./lib/mail')

const { HTTP_PORT, LOG_LEVEL } = process.env
const logger = pino({ level: LOG_LEVEL })

async function start() {
  const app = await initServer(logger, LOG_LEVEL)

  await initTransporter(logger)
  await connectDb(logger)

  const serverProcess = app.listen(HTTP_PORT, () => logger.info(`[setup] Server ready at http://localhost:${HTTP_PORT}`))
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

start().catch(error => logger.error({ err: error }, '[setup] Error starting the server'))
