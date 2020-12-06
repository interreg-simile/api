'use strict'

const path = require('path')
const express = require('express')
const cors = require('cors')()
const helmet = require('helmet')()
const pinoExpress = require('express-pino-logger')()
const bodyParser = require('body-parser')

const setLanguage = require('../middlewares/setLanguage')
const { setRequestConfig } = require('../middlewares/loadConfiguration')
const checkToken = require('../middlewares/checkToken')
const upload = require('../middlewares/upload')
const parseFormdata = require('../middlewares/parseFormdata')

function initMiddlewares(app, logger) {
  app.use(cors)
  app.use(helmet)
  app.use(pinoExpress)

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

  app.use(setLanguage)
  app.use(setRequestConfig)
  app.use(checkToken)
  app.use(upload)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(parseFormdata)

  logger.info('[setup] Middlewares chain initialized')
}

module.exports = { initMiddlewares }
