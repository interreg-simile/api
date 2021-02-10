'use strict'

const mongoose = require('mongoose')
const { collectionName: Users } = require('../users/users.model')
const { collectionName: Rois } = require('../rois/rois.model')

const collectionName = 'Observations'

const position = new mongoose.Schema({
  _id: false,
  type: { type: String, enum: ['Point'], required: true, default: 'Point' },
  coordinates: { type: [Number], required: true },
  crs: { type: { code: Number }, required: true },
  accuracy: { type: Number, required: false },
  roi: { type: mongoose.Schema.Types.ObjectId, ref: Rois, required: false },
  area: { type: Number, required: false },
})

const weather = new mongoose.Schema({
  _id: false,
  temperature: { type: Number, required: false },
  sky: { type: { code: Number }, required: true },
  wind: { type: Number, required: false },
})

const schema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: Users, required: false },
  date: { type: Date, required: true },
  callId: { type: Number, required: false },
  position: { type: position, required: true },
  weather: { type: weather, required: true },
  details: { type: mongoose.Schema.Types.Mixed, required: false },
  measures: { type: mongoose.Schema.Types.Mixed, required: false },
  other: { type: String, required: false },
  photos: { type: [String], required: false },
  markedForDeletion: { type: Boolean, required: true, default: false },
}, { timestamps: true })

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
