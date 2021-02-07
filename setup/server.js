'use strict'

const path = require('path')
const express = require('express')
const sendGridMail = require('@sendgrid/mail')

const { initMiddlewares } = require('./middlewares')
const { initRoutes } = require('./routes')
const handleErrors = require('../middlewares/handleErrors')
const { loadProjections } = require('../lib/spatialOperations')
const initInternationalization = require('../lib/i18n')

const { SENDGRID_API_KEY } = process.env

module.exports = async(logger, logLevel) => {
  const app = express()

  initMiddlewares(app, logger, logLevel)
  initRoutes(app, logger)
  app.use(handleErrors)

  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs')

  loadProjections(logger)

  sendGridMail.setApiKey(SENDGRID_API_KEY)

  await initInternationalization(logger)

  return app
}
