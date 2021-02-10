'use strict'

const _ = require('lodash')
const moment = require('moment')

const { model: observationsModel } = require('./observations.model')
const { CustomError } = require('../../lib/CustomError')
const { projectPoint } = require('../../lib/spatialOperations')
const { getRoiByCoords } = require('../rois/rois.service')

async function getAll(filter, projection, options) {
  return observationsModel.find(filter, projection, { lean: true, ...options })
}

async function getById(id, filter, projection, options) {
  const observation = await observationsModel.findOne({ _id: id, ...filter }, projection, { lean: true, ...options })

  if (!observation) {
    throw new CustomError(404)
  }

  return observation
}

async function create(data) {
  const roi = await getRoiByCoords(data.position.coordinates[0], data.position.coordinates[1])

  if (roi) {
    _.set(data, 'position.area', roi.area.code)

    if (!data.position.roi) {
      _.set(data, 'position.roi', roi._id)
    }
  }

  const observation = new observationsModel({
    ...(data.uid && { uid: data.uid }),
    date: data.createdAt || moment.utc().toISOString(),
    callId: data.callId,
    position: { ...data.position, type: 'Point', crs: { code: 1 } },
    weather: data.weather,
    details: data.details,
    measures: data.measures,
    other: data.other,
    photos: data.photos,
    ...(data.createdAt && { createdAt: data.createdAt }),
  })

  return observation.save()
}

function populateDescriptions(observation, i18n) {
  const originalObject = observation

  const findAndPopulate = (obj, path) => {
    Object.keys(obj).forEach(key => {
      if (key === '_id' || key === 'uid' || key === 'createdAt' || key === 'updatedAt' || key === '__v') {
        return
      }

      path.push(key)

      if (typeof obj[key] === 'object') {
        findAndPopulate(obj[key], path)
        path.pop()
        return
      }

      if (key !== 'code') {
        path.pop()
        return
      }

      path.pop()

      const keyPath = [...path]
      if (!isNaN(keyPath[keyPath.length - 1])) {
        keyPath.pop()
      }

      const instrumentIdx = keyPath.indexOf('instrument')
      if (instrumentIdx !== -1) {
        keyPath.splice((instrumentIdx - 1), 1)
      }

      _.set(
        originalObject,
        [...path, 'description'],
        i18n(`models:observations.${keyPath.join('.')}.${_.get(originalObject, [...path, 'code'])}`)
      )

      path.push(key)
      path.pop()
    })
  }

  findAndPopulate(originalObject, [])
}

function projectObservation(observation, crsCode) {
  const { position: { coordinates } } = observation
  const projectedPoint = projectPoint(crsCode, coordinates[1], coordinates[0])

  observation.position.coordinates = [projectedPoint.lon, projectedPoint.lat]
  observation.position.crs.code = parseInt(crsCode)
}

function convertToGeoJsonFeature(observation) {
  const geoJsonObject = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: observation.position.coordinates,
    },
    properties: {},
  }

  Object.assign(geoJsonObject.properties, observation)
  delete geoJsonObject.properties.position.coordinates

  return geoJsonObject
}

function parseIntDetailsCodeProps(originalDetails) {
  const clonedDetails = _.cloneDeep(originalDetails)

  const loopProps = prop => {
    if (!prop) {
      return
    }

    if (typeof prop === 'object') {
      Object.keys(prop).forEach(key => {
        if (key === 'code' && typeof prop[key] === 'string') {
          prop[key] = parseInt(prop[key])
          return
        }
        loopProps(prop[key])
      })
    }

    if (Array.isArray(prop)) {
      prop.forEach(innerProp => {
        loopProps(innerProp)
      })
    }
  }

  loopProps(clonedDetails)

  return clonedDetails
}

function parseIntMeasuresCodeProps(originalMeasures) {
  const clonedMeasures = _.cloneDeep(originalMeasures)

  Object.keys(clonedMeasures).forEach(measureKey => {
    const measure = clonedMeasures[measureKey]

    const instrumentTypeCode = _.get(measure, 'instrument.type.code')
    if (instrumentTypeCode && typeof instrumentTypeCode === 'string') {
      _.set(measure, 'instrument.type.code', parseInt(instrumentTypeCode))
    }
  })

  return clonedMeasures
}

module.exports = {
  getAll,
  getById,
  create,
  populateDescriptions,
  projectObservation,
  convertToGeoJsonFeature,
  parseIntDetailsCodeProps,
  parseIntMeasuresCodeProps,
}
