'use strict'

const { version } = require('../lib/loadConfigurations')
const { router: authRouter } = require('../modules/auth/auth.route')
const { router: usersRouter } = require('../modules/users/users.route')
const { router: roisRouter } = require('../modules/rois/rois.route')
const { router: alertsRouter } = require('../modules/alerts/alerts.route')
const { router: eventsRouter } = require('../modules/events/events.route')
const { router: observationsRouter } = require('../modules/observations/observations.route')
const { router: miscRouter } = require('../modules/misc/misc.route')

function initRoutes(app, logger) {
  app.use(`/${version}/auth`, authRouter)
  app.use(`/${version}/users`, usersRouter)
  app.use(`/${version}/rois`, roisRouter)
  app.use(`/${version}/alerts`, alertsRouter)
  app.use(`/${version}/events`, eventsRouter)
  app.use(`/${version}/observations`, observationsRouter)
  app.use(`/${version}/misc`, miscRouter)

  logger.info('[setup] Routes initialized')
}

module.exports = { initRoutes }

// TODO setup docs route
/*
server.get(`/${version}/docs`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "docs", "index.html"));
})
 */
