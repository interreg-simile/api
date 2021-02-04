'use strict'

const { model: linksModel } = require('../../../modules/misc/models/links.model')

const data = [
  {
    _id: '111111111111111111111111',
    link: 'link_1',
    name: {
      it: 'Nome 1',
      en: 'Name 1',
    },
    order: 20,
  },
  {
    _id: '222222222222222222222222',
    link: 'link_2',
    name: {
      it: 'Nome 2',
      en: 'Name 2',
    },
    order: 10,
  },
  {
    _id: '333333333333333333333333',
    link: 'link_3',
    name: {
      it: 'Nome 3',
      en: 'Name 3',
    },
    order: 30,
  },
]

async function seed() {
  await linksModel.create(data)
}

module.exports = { data, seed }
