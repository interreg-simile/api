'use strict'

const mongoose = require('mongoose')

const collectionName = 'AuthorityContacts'

const schema = new mongoose.Schema({
  contact: { type: String, required: true },
  type: { type: String, required: true },
  area: { type: Number, required: true },
  instructions: { type: String, required: false },
}, { timestamps: true })

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
