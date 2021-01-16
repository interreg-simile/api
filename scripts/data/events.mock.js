/* eslint-disable newline-per-chained-call */
'use strict'

const moment = require('moment')

module.exports = [
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Evento passato', en: 'Past event' },
    description: { it: 'Descrizione...', en: 'Description...' },
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
    title: { it: 'Evento con dettagli', en: 'Event with details' },
    description: { it: 'Descrizione...', en: 'Description...' },
    hasDetails: true,
    position: {
      type: 'Point',
      coordinates: [8.504056, 45.912573],
      address: 'Corso Giuseppe Garibaldi 23, Baveno (VB), Italia',
      city: 'Baveno',
    },
    date: moment().add(5, 'days').toISOString(),
    contacts: { email: 'email@example.com' },
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Evento senza dettagli', en: 'Event without detailst' },
    description: { it: 'Descrizione...', en: 'Description...' },
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
