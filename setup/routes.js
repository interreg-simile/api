'use strict'

const { version } = require('../middlewares/loadConfiguration')
const { router: roisRouter } = require('../modules/rois/rois.route')
const { router: alertsRouter } = require('../modules/alerts/alerts.route')

function initRoutes(app, logger) {
  app.use(`/${version}/rois`, roisRouter)
  app.use(`/${version}/alerts`, alertsRouter)

  logger.info('[setup] Routes initialized')
}

module.exports = { initRoutes }
