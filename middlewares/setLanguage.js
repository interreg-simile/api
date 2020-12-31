'use strict'

const i18next = require('i18next')
const loadConfiguration = require('../lib/loadConfigurations')

module.exports = (req, res, next) => {
  let { defaultLng: lng } = loadConfiguration.appConf

  const lngHeader = req.get('Accept-Language')

  if (lngHeader) {
    lngHeader.split(',').some(acceptedLanguage => {
      if (loadConfiguration.appConf.lngs.includes(acceptedLanguage.trim())) {
        lng = acceptedLanguage.trim()
        return true
      }

      return false
    })
  }

  req.lng = lng
  req.t = i18next.getFixedT(lng)
  res.set('Content-Language', lng)

  next()
}
