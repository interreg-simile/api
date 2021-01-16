'use strict'

const bcrypt = require('bcryptjs')

const plainData = [
  {
    _id: '5dd7bbe0701d5bdd685c2a46',
    email: 'demo1@example.com',
    isConfirmed: 'true',
    name: 'Mario',
    surname: 'Rossi',
  },
  {
    _id: '5dd7bbe0701d5bdd685c2a47',
    email: 'demo2@example.com',
    isConfirmed: 'true',
    name: 'Giulia',
    surname: 'Bianchi',
    city: 'Lecco',
    yearOfBirth: 1990,
    gender: 'female',
  },
]

module.exports = async function createData() {
  const hashPassword = await bcrypt.hash('12345678', 12)

  return [
    { ...plainData[0], password: hashPassword },
    { ...plainData[1], password: hashPassword },
  ]
}
