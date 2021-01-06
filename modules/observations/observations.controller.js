'use strict'

const _ = require('lodash')
const service = require('./observations.service')
const { CustomError } = require('../../lib/CustomError')

async function getAll(req, res, next) {
  const { minimalRes = 'false', excludeOutOfRois = 'false', crs = '1', mode = 'json' } = req.query

  const query = { markedForDeletion: false }
  if (excludeOutOfRois === 'true') {
    query['position.roi'] = { $exists: true }
  }

  const projection = {}
  if (minimalRes === 'true') {
    projection._id = 1
    projection.uid = 1
    projection['position.coordinates'] = 1
    projection['position.crs'] = 1
    projection['position.roi'] = 1
  } else {
    projection.markedForDeletion = 0
  }

  try {
    const observations = await service.getAll(query, projection, {})
    const geoJsonData = mode === 'geojson' ? { type: 'FeatureCollection', features: [] } : null

    observations.forEach(observation => {
      if (crs !== '1') {
        service.projectObservation(observation, crs)
      }

      service.populateDescriptions(observation, req.t)

      if (geoJsonData) {
        geoJsonData.features.push(service.convertToGeoJsonFeature(observation))
      }
    })

    res.status(200).json({ meta: { code: 200 }, data: geoJsonData || observations })
  } catch (error) {
    req.log.error({ error, query, projection }, 'Error retrieving observations')
    return next(new CustomError(500, error.message))
  }
}

async function getById(req, res, next) {
  const { id } = req.params
  const { crs = '1', mode = 'json' } = req.query

  const query = { markedForDeletion: false }
  const projection = { markedForDeletion: 0 }

  try {
    let observation = await service.getById(id, query, projection, {})

    if (crs !== '1') {
      service.projectObservation(observation, crs)
    }

    service.populateDescriptions(observation, req.t)

    if (mode === 'geojson') {
      observation = service.convertToGeoJsonFeature(observation)
    }

    res.status(200).json({ meta: { code: 200 }, data: observation })
  } catch (error) {
    req.log.error({ error, id, query, projection }, 'Error retrieving observation')
    return next(error instanceof CustomError ? error : new CustomError(500, error.message))
  }
}

async function create(req, res, next) {
  const { minimalRes = 'false', generateCallId = 'false' } = req.query

  const data = { ...req.body, uid: req.userId }

  if (data.details) { data.details = service.parseIntDetailsCodeProps(data.details) }
  if (data.measures) { data.measures = service.parseIntMeasuresCodeProps(data.measures) }

  if (generateCallId === 'true') {
    data.callId = Math.floor(10000 + (Math.random() * 90000))
  }

  if (_.has(req, ['files', 'photos'])) {
    data.photos = req.files.photos.map(photo => `uploads/${photo.filename}`)
  }

  if (_.has(req, ['files', 'signage'])) {
    _.set(data, ['details', 'outlets', 'signagePhoto'], `uploads/${req.files.signage[0].filename}`)
  }

  try {
    const newObservation = await service.create(data)

    let minimalResponse
    if (minimalRes === 'true') {
      minimalResponse = {
        _id: newObservation._id,
        ...(newObservation.uid && { uid: newObservation.uid }),
        callId: newObservation.callId,
        position: {
          coordinates: newObservation.position.coordinates,
          roi: newObservation.position.roi,
          area: newObservation.position.area,
        },
      }
    }

    res.status(201).json({ meta: { code: 201 }, data: minimalResponse || newObservation })
  } catch (error) {
    req.log.error({ error, data }, 'Error creating observation')
    return next(new CustomError(500, error.message))
  }
}

module.exports = { getAll, getById, create }
