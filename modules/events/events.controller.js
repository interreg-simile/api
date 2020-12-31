'use strict'

const moment = require('moment')

const service = require('./events.service')
const { CustomError } = require('../../lib/CustomError')
const { getMongoSortFromQuerySort } = require('../../lib/utils')

async function getAll(req, res, next) {
  const { includePast = 'true', sort } = req.query

  const query = { markedForDeletion: false }
  if (includePast === 'false') {
    query.date = { $gte: moment().toISOString() }
  }

  const projection = { uid: 0, markedForDeletion: 0 }

  const options = {}
  if (sort) {
    options.sort = getMongoSortFromQuerySort(sort)
  }

  try {
    const events = await service.getAll(query, projection, options)
    res.status(200).json({ meta: { code: 200 }, data: events })
  } catch (error) {
    req.log.error({ error, query, projection, options }, 'Error retrieving events')
    return next(new CustomError(500, error.message))
  }
}

async function getById(req, res, next) {
  const { id } = req.params

  const query = { markedForDeletion: false }
  const projection = { uid: 0, markedForDeletion: 0 }

  try {
    const events = await service.getById(id, query, projection, {})
    res.status(200).json({ meta: { code: 200 }, data: events })
  } catch (error) {
    req.log.error({ error, id, query, projection }, 'Error retrieving event')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

module.exports = { getAll, getById }
