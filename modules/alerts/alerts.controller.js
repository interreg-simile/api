'use strict'

const moment = require('moment')

const service = require('./alerts.service')
const { CustomError } = require('../../lib/CustomError')
const { getMongoSortFromQuerySort } = require('../../lib/utils')

async function getAll(req, res, next) {
  const { includePast = 'true', includeDeleted = 'false', sort } = req.query

  const query = {}
  if (includeDeleted === 'false') { query.markedForDeletion = false }
  if (includePast === 'false') { query.dateEnd = { $gte: moment().toISOString() } }

  const projection = {}
  if (!req.isAdmin) { projection.uid = 0 }

  const options = {}
  if (sort) { options.sort = getMongoSortFromQuerySort(sort) }

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

  const query = {}
  const projection = {}
  if (!req.isAdmin) {
    query.markedForDeletion = false
    projection.uid = 0
  }

  try {
    const alert = await service.getById(id, query, projection, {})
    res.status(200).json({ meta: { code: 200 }, data: alert })
  } catch (error) {
    req.log.error({ error, id, query, projection }, 'Error retrieving alert')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function create(req, res, next) {
  const { userId, body } = req

  const data = { uid: userId, ...body }

  try {
    const newAlert = await service.create(data)
    res.status(200).json({ meta: { code: 201 }, data: newAlert })
  } catch (error) {
    req.log.error({ error, userId, body }, 'Error creating alert')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function upsert(req, res, next) {
  const { userId, body } = req
  const { id } = req.params

  const data = { uid: userId, ...body }

  try {
    const result = await service.upsert(id, data)
    const code = result.created ? 201 : 200
    res.status(200).json({ meta: { code }, data: result.newAlert })
  } catch (error) {
    req.log.error({ error, id, userId, body }, 'Error upserting alert')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function softDelete(req, res, next) {
  const { id } = req.params

  try {
    await service.softDelete(id)
    res.status(200).json({ meta: { code: 204 } })
  } catch (error) {
    req.log.error({ error, id }, 'Error deleting alert')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

module.exports = { getAll, getById, create, upsert, softDelete }
