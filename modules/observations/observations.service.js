'use strict'

const _ = require('lodash')

const { model: observationsModel } = require('./observations.model')
const { CustomError } = require('../../lib/CustomError')
const { projectPoint } = require('../../lib/spatialOperations')

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

module.exports = { getAll, getById, populateDescriptions, projectObservation, convertToGeoJsonFeature }
