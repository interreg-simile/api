'use strict'

const { version } = require('../middlewares/loadConfiguration')

function initRoutes(app, logger) {
  app.get(`/${version}/`, (req, res) => {
    res.status(200).send('Hello World!')
  })

  logger.info('[setup] Routes initialized')
}

module.exports = { initRoutes }
