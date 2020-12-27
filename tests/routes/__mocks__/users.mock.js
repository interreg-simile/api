/* eslint-disable newline-per-chained-call */
'use strict'

const bcrypt = require('bcryptjs')
const { model: usersModel } = require('../../../modules/users/users.model')

async function createData() {
  const hashPassword = await bcrypt.hash('123456', 5)

  return [
    {
      _id: '000000000000000000000001',
      email: 'admin@example.com',
      password: hashPassword,
      isConfirmed: 'true',
      name: 'Giulia',
      surname: 'Bianchi',
      city: 'Lecco',
      yearOfBirth: 1990,
      gender: 'female',
    },
    {
      _id: '000000000000000000000002',
      email: 'user@example.com',
      password: hashPassword,
      isConfirmed: 'true',
      name: 'Mario',
      surname: 'Rossi',
      city: 'Como',
      yearOfBirth: 1984,
      gender: 'male',
    },
  ]
}

async function seed() {
  const data = await createData()
  await usersModel.create(data)
}

module.exports = { createData, seed }
