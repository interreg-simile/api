/* eslint-disable newline-per-chained-call */
'use strict'

const moment = require('moment')
const { model: eventsModel } = require('../../../modules/events/events.model')

const data = [
  {
    _id: '111111111111111111111111',
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Past event', en: 'Past event' },
    description: { it: 'Description...', en: 'Description...' },
    links: [
      {
        nameIta: 'Link Uno',
        nameEng: 'link One',
        url: 'https://www.google.com/',
      },
    ],
    hasDetails: true,
    position: {
      type: 'Point',
      coordinates: [8.504056, 45.912573],
      address: 'Corso Giuseppe Garibaldi 23, Baveno (VB), Italia',
      city: 'Baveno',
    },
    date: moment().subtract(1, 'days').toISOString(),
    contacts: { email: 'email@example.com' },
    markedForDeletion: false,
  },
  {
    _id: '222222222222222222222222',
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Valid event', en: 'Valid event' },
    description: { it: 'Description...', en: 'Description...' },
    links: [
      {
        nameIta: 'Link Uno',
        nameEng: 'link One',
        url: 'https://www.google.com/',
      },
    ],
    hasDetails: true,
    position: {
      type: 'Point',
      coordinates: [8.504056, 45.912573],
      address: 'Corso Giuseppe Garibaldi 23, Baveno (VB), Italia',
      city: 'Baveno',
    },
    date: moment().add(1, 'days').toISOString(),
    contacts: { email: 'email@example.com' },
    markedForDeletion: false,
  },
  {
    _id: '333333333333333333333333',
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Deleted event', en: 'Deleted event' },
    description: { it: 'Description...', en: 'Description...' },
    links: [
      {
        nameIta: 'Link Uno',
        nameEng: 'link One',
        url: 'https://www.google.com/',
      },
    ],
    hasDetails: true,
    position: {
      type: 'Point',
      coordinates: [8.504056, 45.912573],
      address: 'Corso Giuseppe Garibaldi 23, Baveno (VB), Italia',
      city: 'Baveno',
    },
    date: moment().add(1, 'days').toISOString(),
    contacts: { email: 'email@example.com' },
    markedForDeletion: true,
  },
]

async function seed() {
  await eventsModel.create(data)
}

module.exports = { data, seed }
