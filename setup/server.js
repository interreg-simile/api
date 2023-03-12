'use strict'

const path = require('path')
const express = require('express')

const { initMiddlewares } = require('./middlewares')
const { initRoutes } = require('./routes')
const handleErrors = require('../middlewares/handleErrors')
const { loadProjections } = require('../lib/spatialOperations')
const initInternationalization = require('../lib/i18n')
const { initTransporter, loadEmailTemplates } = require('../lib/mail')

module.exports = async(logger, logLevel) => {
  const app = express()

  initMiddlewares(app, logger, logLevel)
  initRoutes(app, logger)
  app.use(handleErrors)

  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs')

  loadProjections(logger)

  await initTransporter(logger)
  loadEmailTemplates()

  await initInternationalization(logger)

  return app
}
