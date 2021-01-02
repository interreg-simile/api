'use strict'

const path = require('path')
const express = require('express')
const cors = require('cors')()
const helmet = require('helmet')()
const pinoExpress = require('express-pino-logger')
const setLanguage = require('../middlewares/setLanguage')

function initMiddlewares(app, logger, logLevel) {
  app.use(cors)
  app.use(helmet)
  app.use(pinoExpress({ level: logLevel }))

  // TODO set correct route
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

  app.use(setLanguage)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  logger.info('[setup] Middlewares chain initialized')
}

module.exports = { initMiddlewares }
