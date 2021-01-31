'use strict'

const mongoose = require('mongoose')

const collectionName = 'Users'

const emailConfirmationToken = new mongoose.Schema({
  _id: false,
  token: { type: String, required: true },
  validUntil: { type: Date, required: true },
})

const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isConfirmed: { type: Boolean, required: true, default: false },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  city: { type: String, required: false },
  yearOfBirth: { type: Number, required: false },
  gender: { type: String, required: false },
  emailConfirmationToken: { type: emailConfirmationToken, required: false },
}, { timestamps: true })

const model = mongoose.model(collectionName, schema, collectionName)

module.exports = { collectionName, model }
