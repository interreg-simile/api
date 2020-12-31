'use strict'

const path = require('path')
const yaml = require('yamljs')

const generalConfiguration = yaml.load(path.resolve('./config/default.yaml'))
const modelsConfiguration = yaml.load(path.resolve('./config/models.yaml'))

module.exports = {
  generalConfiguration,
  modelsConfiguration,
  appConf: generalConfiguration.app,
  version: `v${generalConfiguration.app.version}`,
}
