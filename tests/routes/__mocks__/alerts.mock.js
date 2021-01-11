/* eslint-disable newline-per-chained-call */
'use strict'

const moment = require('moment')
const { model: alertsModel } = require('../../../modules/alerts/alerts.model')

const data = [
  {
    _id: '111111111111111111111111',
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Past alert', en: 'Past alert' },
    links: [
      {
        nameIta: 'Link Uno',
        nameEng: 'link One',
        url: 'https://www.google.com/',
      },
    ],
    content: { it: 'Content...', en: 'Content...' },
    position: { type: 'Point', coordinates: [0, 0] },
    dateEnd: moment().subtract(1, 'days').toISOString(),
    markedForDeletion: false,
    createdAt: moment('2020-01-01').toISOString(),
  },
  {
    _id: '222222222222222222222222',
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Valid alert', en: 'Valid alert' },
    links: [],
    content: { it: 'Content...', en: 'Content...' },
    dateEnd: moment().add(1, 'days').toISOString(),
    markedForDeletion: false,
    createdAt: moment('2020-03-01').toISOString(),
  },
  {
    _id: '333333333333333333333333',
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Deleted alert', en: 'Deleted alert' },
    links: [],
    content: { it: 'Content...', en: 'Content...' },
    dateEnd: moment().add(1, 'days').toISOString(),
    markedForDeletion: true,
    createdAt: moment('2020-02-01').toISOString(),
  },
]

async function seed() {
  await alertsModel.create(data)
}

module.exports = { data, seed }
