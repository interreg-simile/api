'use strict'

const mongoose = require('mongoose')
const { polygonSchema } = require('../../lib/commonSchemas')

const collectionName = 'Rois'

const schema = new mongoose.Schema({
  country: { type: { _id: false, code: Number }, required: true },
  area: { type: { _id: false, code: Number }, required: true },
  lake: { type: { _id: false, code: Number }, required: true },
  geometry: { type: polygonSchema, required: true },
})

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
