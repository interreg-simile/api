'use strict'

const { version } = require('../middlewares/loadConfiguration')
const { router: authRouter } = require('../modules/auth/auth.route')
const { router: usersRouter } = require('../modules/users/users.route')
const { router: roisRouter } = require('../modules/rois/rois.route')
const { router: alertsRouter } = require('../modules/alerts/alerts.route')
const { router: eventsRouter } = require('../modules/events/events.route')
const { router: miscRouter } = require('../modules/misc/misc.route')

function initRoutes(app, logger) {
  app.use(`/${version}/auth`, authRouter)
  app.use(`/${version}/users`, usersRouter)
  app.use(`/${version}/rois`, roisRouter)
  app.use(`/${version}/alerts`, alertsRouter)
  app.use(`/${version}/events`, eventsRouter)
  app.use(`/${version}/misc`, miscRouter)

  logger.info('[setup] Routes initialized')
}

module.exports = { initRoutes }
