'use strict'

const path = require('path')
const yaml = require('yamljs')
const { find } = require('lodash')
const { match } = require('path-to-regexp')

const { CustomError } = require('../lib/CustomError')

const generalConf = yaml.load(path.resolve('./config/default.yaml'))
const endpointsConf = yaml.load(path.resolve('./config/endpoints.yaml'))

const { app: appConf } = generalConf
const version = `v${generalConf.app.version}`

function setRequestConfig(req, res, next) {
  const baseUrl = `/${req.path.split('/')[2]}`
  const reqPath = req.path.replace(`/${version}${baseUrl}`, '')

  const params = find(endpointsConf[baseUrl], i => match(i.path)(reqPath) && i.method === req.method)

  if (!params) {
    req.log.error('Route not found')
    throw new CustomError(404, 'Route not found')
  }

  req.config = params
  next()
}

module.exports = { appConf, version, setRequestConfig }
