/* eslint-disable newline-per-chained-call */
'use strict'

const { LoremIpsum } = require('lorem-ipsum')
const moment = require('moment')

const fakeContent = new LoremIpsum().generateParagraphs(2)

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
    content: { it: fakeContent, en: fakeContent },
    dateEnd: moment().subtract(1, 'days').toISOString(),
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Avviso per Lecco!', en: 'Alert for Lecco!' },
    content: { it: fakeContent, en: fakeContent },
    position: { type: 'Point', coordinates: [9.387995, 45.855848] },
    dateEnd: moment().add(20, 'days').toISOString(),
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Avviso generale!', en: 'General alert!' },
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
    content: { it: fakeContent, en: fakeContent },
    dateEnd: moment().add(10, 'days').toISOString(),
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c1f10',
    title: { it: 'Avviso cancellato', en: 'Deleted alert' },
    content: { it: fakeContent, en: fakeContent },
    dateEnd: moment().add(2, 'days').toISOString(),
    markedForDeletion: true,
  },
]
