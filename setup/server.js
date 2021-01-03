'use strict'

const express = require('express')

const { initMiddlewares } = require('./middlewares')
const { initRoutes } = require('./routes')
const handleErrors = require('../middlewares/handleErrors')
const { loadProjections } = require('../lib/spatialOperations')
const initInternationalization = require('../lib/i18n')

module.exports = async(logger, logLevel) => {
  const app = express()

  initMiddlewares(app, logger, logLevel)
  initRoutes(app, logger)
  app.use(handleErrors)

  loadProjections(logger)

  await initInternationalization(logger)

  return app
}
