'use strict'

const mongoose = require('mongoose')
const { collectionName: Users } = require('../users/users.model')

const collectionName = 'Events'

const position = new mongoose.Schema({
  _id: false,
  type: { type: String, enum: ['Point'], required: false, default: 'Point' },
  coordinates: { type: [Number], required: false },
  address: { type: String, required: false },
  city: { type: String, required: false },
})

const link = new mongoose.Schema({
  _id: false,
  nameIta: { type: String, required: true },
  nameEng: { type: String, required: true },
  url: { type: String, required: true },
})

const contacts = new mongoose.Schema({
  _id: false,
  email: { type: String, required: false },
  phone: { type: String, required: false },
})

const schema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: Users, required: true },
  title: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: mongoose.Schema.Types.Mixed, required: true },
  links: { type: [link], required: false },
  hasDetails: { type: Boolean, required: false, default: true },
  position: { type: position, required: false },
  date: { type: Date, required: true },
  contacts: { type: contacts, required: true },
  markedForDeletion: { type: Boolean, required: true, default: false },
}, { timestamps: true })

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
