'use strict'

const moment = require('moment')

const service = require('./alerts.service')
const { CustomError } = require('../../lib/CustomError')
const { getMongoSortFromQuerySort } = require('../../lib/utils')

async function getAll(req, res, next) {
  const { includePast = 'true', sort } = req.query

  const query = { markedForDeletion: false }
  if (includePast === 'false') {
    query.dateEnd = { $gte: moment().toISOString() }
  }

  const projection = { uid: 0, markedForDeletion: 0 }

  const options = {}
  if (sort) {
    options.sort = getMongoSortFromQuerySort(sort)
  }

  try {
    const alerts = await service.getAll(query, projection, options)
    res.status(200).json({ meta: { code: 200 }, data: alerts })
  } catch (error) {
    req.log.error({ error, query, projection, options }, 'Error retrieving alerts')
    return next(new CustomError(500, error.message))
  }
}

async function getById(req, res, next) {
  const { id } = req.params

  const query = { markedForDeletion: false }
  const projection = { uid: 0, markedForDeletion: 0 }

  try {
    const alert = await service.getById(id, query, projection, {})
    res.status(200).json({ meta: { code: 200 }, data: alert })
  } catch (error) {
    req.log.error({ error, id, query, projection }, 'Error retrieving alert')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

module.exports = { getAll, getById }
