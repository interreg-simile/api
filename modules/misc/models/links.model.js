'use strict'

const mongoose = require('mongoose')

const collectionName = 'Links'

const schema = new mongoose.Schema({
  link: { type: String, required: true },
  name: { type: mongoose.Schema.Types.Mixed, required: true },
  order: { type: Number, required: true },
}, { timestamps: true })

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
