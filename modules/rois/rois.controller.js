'use strict'

const service = require('./rois.service')
const { CustomError } = require('../../lib/CustomError')

async function getAll(req, res, next) {
  const { lat, lon, includeCoords } = req.query

  const query = {}
  if (lat && lon) {
    query.geometry = {
      $geoIntersects: {
        $geometry: { type: 'Point', coordinates: [lon, lat] },
      },
    }
  }

  const projection = (!includeCoords || includeCoords === 'false') ? { geometry: 0 } : {}

  try {
    const rois = await service.getAll(query, projection, req.t)
    res.status(200).json({ meta: { code: 200 }, data: rois })
  } catch (error) {
    req.log.error({ error, query, projection }, 'Error retrieving rois')
    return next(new CustomError(500, error.message))
  }
}

module.exports = { getAll }
