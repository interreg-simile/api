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

async function create(data) {
  const alert = new alertsModel({
    uid: data.uid,
    title: data.title,
    links: data.links,
    content: data.content,
    dateEnd: data.dateEnd,
  })

  if (data.id) {
    alert._id = data.id
  }

  return alert.save()
}

async function upsert(id, data) {
  const alert = await alertsModel.findById(id)

  if (!alert) {
    const newAlert = await create({ id, ...data })
    return { newAlert, created: true }
  }

  alert.title = data.title
  alert.links = data.links
  alert.content = data.content
  alert.dateEnd = data.dateEnd

  const newAlert = await alert.save()
  return { newAlert, created: false }
}

async function softDelete(id) {
  const alert = await alertsModel.findOne({ _id: id, markedForDeletion: false })

  if (!alert) {
    throw new CustomError(404)
  }

  alert.markedForDeletion = true
  await alert.save()
}

module.exports = { getAll, getById, create, upsert, softDelete }
