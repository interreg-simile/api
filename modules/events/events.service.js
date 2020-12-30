'use strict'

const { model: eventsModel } = require('./events.model')
const { CustomError } = require('../../lib/CustomError')

async function getAll(filter, projection, options) {
  return eventsModel.find(filter, projection, { lean: true, ...options })
}

async function getById(id, filter, projection, options) {
  const event = await eventsModel.findOne({ _id: id, ...filter }, projection, { lean: true, ...options })

  if (!event) {
    throw new CustomError(404)
  }

  return event
}

module.exports = { getAll, getById }
