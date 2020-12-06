'use strict'

const i18next = require('i18next')
const backend = require('i18next-node-fs-backend')

const { appConf } = require('../middlewares/loadConfiguration')

module.exports = async(logger) => {
  i18next.use(backend)
  await i18next.init({
    preload: appConf.lngs,
    ns: ['models'],
    backend: { loadPath: './i18n/{{lng}}/{{ns}}.yml' },
  })

  logger.info('[setup] Internationalization initialized')
}
