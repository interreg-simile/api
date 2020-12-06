'use strict'

const path = require('path')
const yaml = require('yamljs')
const proj4 = require('proj4')

function loadProjections(logger) {
  const { crs } = yaml.load(path.resolve('./config/default.yaml'))
  Object.keys(crs).forEach(crsKey => proj4.defs(crsKey, crs[crsKey]))

  logger.info('[setup] Projections loaded')
}

function projectPoint(projectionCode, lat, lon) {
  const WGS84Projection = proj4.defs('1')
  const toProjection = proj4.defs(projectionCode)

  const projectedCoords = proj4(WGS84Projection, toProjection, [lat, lon])

  return { lat: projectedCoords[0], lon: projectedCoords[1] }
}

module.exports = { loadProjections, projectPoint }
