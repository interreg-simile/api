'use strict'

const { model: alertsModel } = require('./alerts.model')
const { CustomError } = require('../../lib/CustomError')

async function getAll(filter, projection, options) {
  return alertsModel.find(filter, projection, { lean: true, ...options })
}

async function getById(id, filter, projection, options) {
  const alert = await alertsModel.findOne({ _id: id, ...filter }, projection, { lean: true, ...options })

  if (!alert) {
    throw new CustomError(404)
  }

  return alert
}

module.exports = { getAll, getById }
