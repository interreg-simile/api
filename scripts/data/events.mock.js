/* eslint-disable newline-per-chained-call */
'use strict'

const { LoremIpsum } = require('lorem-ipsum')
const moment = require('moment')

const fakeDescription = new LoremIpsum().generateParagraphs(2)

module.exports = [
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Evento passato', en: 'Past event' },
    description: { it: fakeDescription, en: fakeDescription },
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
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Evento a Lecco', en: 'Event in Lecco' },
    description: { it: fakeDescription, en: fakeDescription },
    hasDetails: true,
    position: {
      type: 'Point',
      coordinates: [9.396266, 45.846094],
      address: 'Via dell\'Isola 17, Lecco (LC), Italia',
      city: 'Lecco',
    },
    date: moment().add(20, 'days').toISOString(),
    contacts: { email: 'email@example.com' },
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Evento online', en: 'Online event' },
    description: { it: fakeDescription, en: fakeDescription },
    links: [
      {
        nameIta: 'Link Uno',
        nameEng: 'link One',
        url: 'https://www.google.com/',
      },
      {
        nameIta: 'Link Due',
        nameEng: 'link Two',
        url: 'https://it.yahoo.com/',
      },
    ],
    hasDetails: false,
    date: moment().add(10, 'days').toISOString(),
    contacts: { email: 'email@example.com', phone: '+3933492678' },
    markedForDeletion: false,
  },
]
