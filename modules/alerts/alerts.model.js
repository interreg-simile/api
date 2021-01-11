'use strict'

const mongoose = require('mongoose')
const { collectionName: Users } = require('../users/users.model')

const collectionName = 'Alerts'

const pointSchema = new mongoose.Schema({
  _id: false,
  type: { type: String, enum: ['Point'], required: false, default: 'Point' },
  coordinates: { type: [Number], required: false },
})

const link = new mongoose.Schema({
  _id: false,
  nameIta: { type: String, required: true },
  nameEng: { type: String, required: true },
  url: { type: String, required: true },
})

const schema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: Users, required: true },
  title: { type: mongoose.Schema.Types.Mixed, required: true },
  links: { type: [link], required: false },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  position: { type: pointSchema, required: false },
  dateEnd: { type: Date, required: true },
  markedForDeletion: { type: Boolean, required: true, default: false },
}, { timestamps: true })

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
