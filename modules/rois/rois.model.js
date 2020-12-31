'use strict'

const mongoose = require('mongoose')

const collectionName = 'Rois'

const polygonSchema = new mongoose.Schema({
  _id: false,
  type: { type: String, enum: ['Polygon'], required: true, default: 'Polygon' },
  coordinates: { type: [[[Number]]], required: true },
})

const schema = new mongoose.Schema({
  country: { type: { _id: false, code: Number }, required: true },
  area: { type: { _id: false, code: Number }, required: true },
  lake: { type: { _id: false, code: Number }, required: true },
  geometry: { type: polygonSchema, required: true },
}, { timestamps: true })

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
