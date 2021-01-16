/* eslint-disable newline-per-chained-call */
'use strict'

const moment = require('moment')

module.exports = [
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Avviso passato', en: 'Past alert' },
    links: [
      {
        nameIta: 'Link Uno',
        nameEng: 'link One',
        url: 'https://www.google.com/',
      },
    ],
    content: { it: 'Contenuto...', en: 'Content...' },
    dateEnd: moment().subtract(1, 'days').toISOString(),
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Avviso con posizione', en: 'Alert with position' },
    content: { it: 'Contenuto...', en: 'Content...' },
    position: { type: 'Point', coordinates: [8.972711, 45.910172] },
    dateEnd: moment().add(5, 'days').toISOString(),
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Avviso senza posizione', en: 'Alert without position' },
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
    content: { it: 'Contenuto...', en: 'Content...' },
    dateEnd: moment().add(10, 'days').toISOString(),
    markedForDeletion: true,
  },
]
