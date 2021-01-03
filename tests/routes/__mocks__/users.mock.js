/* eslint-disable newline-per-chained-call */
'use strict'

const bcrypt = require('bcryptjs')
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
  },
]

async function createData() {
  const hashPassword = await bcrypt.hash(plainPassword, 5)

  return [
    { ...plainData[0], password: hashPassword },
    { ...plainData[1], password: hashPassword },
    { ...plainData[2], password: hashPassword },
  ]
}

async function seed() {
  const data = await createData()
  await usersModel.create(data)
}

module.exports = { plainPassword, plainData, seed }
