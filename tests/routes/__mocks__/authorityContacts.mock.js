'use strict'

const { model: contactsModel } = require('../../../modules/misc/models/authorityContacts.model')

const data = [
  {
    _id: '111111111111111111111111',
    contact: 'contact',
    type: 'phone',
    area: 1,
    instructions: {
      it: 'Istruzioni...',
      en: 'Instructions...',
    },
  },
  {
    _id: '222222222222222222222222',
    contact: 'contact',
    type: 'site',
    area: 3,
  },
  {
    _id: '333333333333333333333333',
    contact: 'contact',
    type: 'phone',
    area: 2,
    instructions: {
      it: 'Istruzioni...',
      en: 'Instructions...',
    },
  },
]

async function seed() {
  await contactsModel.create(data)
}

module.exports = { data, seed }
