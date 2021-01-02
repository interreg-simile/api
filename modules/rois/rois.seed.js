'use strict'

const fs = require('fs').promises
const path = require('path')

const { model: roisModel } = require('./rois.model')

module.exports = async() => {
  const dataFiles = await fs.readdir(path.resolve(__dirname, 'data'))

  // eslint-disable-next-line global-require
  const rois = dataFiles.map(file => require(`./data/${file}`))

  await roisModel.create(rois)
}
