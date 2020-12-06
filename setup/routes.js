'use strict'

const { version } = require('../middlewares/loadConfiguration')
const { router: roisRouter } = require('../modules/rois/rois.route')

function initRoutes(app, logger) {
  app.use(`/${version}/rois`, roisRouter)

  logger.info('[setup] Routes initialized')
}

module.exports = { initRoutes }
