/* eslint-disable newline-per-chained-call */
'use strict'

const bcrypt = require('bcryptjs')
const moment = require('moment')
const { model: usersModel } = require('../../../modules/users/users.model')

const plainPassword = '12345678'

const plainData = [
  {
    _id: '000000000000000000000001',
    email: 'user@example.com',
    password: plainPassword,
    isConfirmed: 'true',
    name: 'Mario',
    surname: 'Rossi',
    city: 'Como',
    yearOfBirth: 1984,
    gender: 'male',
  },
  {
    _id: '000000000000000000000002',
    email: 'user2@example.com',
    password: plainPassword,
    isConfirmed: 'true',
    name: 'Giulia',
    surname: 'Bianchi',
    city: 'Lecco',
    yearOfBirth: 1990,
    gender: 'female',
    emailConfirmationToken: {
      token: 'token',
      validUntil: moment.utc().add(1, 'd'),
    },
  },
  {
    _id: '000000000000000000000003',
    email: 'not-verified@example.com',
    password: plainPassword,
    isConfirmed: 'false',
    name: 'Giorgio',
    surname: 'Verdi',
    city: 'Milano',
    yearOfBirth: 1995,
    gender: 'other',
    emailConfirmationToken: {
      token: 'token',
      validUntil: '2000-01-01T00:00:00.000Z',
    },
  },
  {
    _id: '000000000000000000000004',
    email: 'not-verified2@example.com',
    password: plainPassword,
    isConfirmed: 'false',
    name: 'Giorgio',
    surname: 'Verdi',
    city: 'Milano',
    yearOfBirth: 1995,
    gender: 'other',
    emailConfirmationToken: {
      token: 'token',
      validUntil: moment.utc().add(1, 'd'),
    },
  },
]

async function createData() {
  const hashPassword = await bcrypt.hash(plainPassword, 5)

  return [
    { ...plainData[0], password: hashPassword },
    { ...plainData[1], password: hashPassword },
    { ...plainData[2], password: hashPassword },
    { ...plainData[3], password: hashPassword },
  ]
}

async function seed() {
  const data = await createData()
  await usersModel.create(data)
}

module.exports = { plainPassword, plainData, seed }
