'use strict'

const { LoremIpsum } = require('lorem-ipsum')

const fakeInstructions = new LoremIpsum().generateSentences(2)

module.exports = [
  {
    contact: '0000000000',
    type: 'phone',
    area: 1,
    instructions: {
      it: fakeInstructions,
      en: fakeInstructions,
    },
  },
  {
    contact: '0000000000',
    type: 'phone',
    area: 2,
  },
  {
    contact: 'https://www.google.it',
    type: 'site',
    area: 3,
    instructions: {
      it: fakeInstructions,
      en: fakeInstructions,
    },
  },
]
