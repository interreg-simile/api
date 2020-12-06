'use strict'

const path = require('path')
const yaml = require('yamljs')
const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema({
  _id: false,
  type: { type: String, enum: ['Point'], required: true, default: 'Point' },
  coordinates: { type: [Number], required: true },
})

const polygonSchema = new mongoose.Schema({
  _id: false,
  type: { type: String, enum: ['Polygon'], required: true, default: 'Polygon' },
  coordinates: { type: [[[Number]]], required: true },
})

function generateDescriptionCodeSchema(modelName, propertyName) {
  const modelsConfiguration = yaml.load(path.resolve('./config/models.yaml'))

  const modelConfiguration = modelsConfiguration[modelName]
  const propertyPath = `${modelName}.${propertyName}`

  return {
    code: { type: Number, min: modelConfiguration.min, max: modelConfiguration.max },
    dPath: { type: String, default: propertyPath },
  }
}

module.exports = { pointSchema, polygonSchema, generateDescriptionCodeSchema }
