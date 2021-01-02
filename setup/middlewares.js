'use strict'

const express = require('express')
const cors = require('cors')()
const helmet = require('helmet')()
const pinoExpress = require('express-pino-logger')
const setLanguage = require('../middlewares/setLanguage')

const { UPLOAD_PATH } = process.env

function initMiddlewares(app, logger, logLevel) {
  app.use(cors)
  app.use(helmet)
  app.use(pinoExpress({ level: logLevel }))

  app.use('/uploads', express.static(UPLOAD_PATH))

  app.use(setLanguage)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  logger.info('[setup] Middlewares chain initialized')
}

module.exports = { initMiddlewares }
