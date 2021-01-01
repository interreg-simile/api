'use strict'

const { model: roisModel } = require('./rois.model')

async function getAll(query, projection, i18n) {
  const rois = await roisModel.find(query, projection, { lean: true })

  for (const roi of rois) {
    populateDescriptions(roi, i18n)
  }

  return rois
}

async function getRoiByCoords(lon, lat) {
  const filter = {
    geometry: {
      $geoIntersects: {
        $geometry: { type: 'Point', coordinates: [lon, lat] },
      },
    },
  }

  return roisModel.findOne(filter, {}, { lean: true })
}

function populateDescriptions(roi, i18n) {
  roi.country['description'] = i18n(`models:rois.country.${roi.country.code}`)
  roi.area['description'] = i18n(`models:rois.area.${roi.area.code}`)
  roi.lake['description'] = i18n(`models:rois.lake.${roi.lake.code}`)
}

module.exports = { getAll, getRoiByCoords }
