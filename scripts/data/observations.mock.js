/* eslint-disable newline-per-chained-call */
'use strict'

const moment = require('moment')

module.exports = [
  {
    uid: '5dd7bbe0701d5bdd685c2a46',
    callId: 1234,
    position: {
      type: 'Point',
      coordinates: [9.332834, 45.897758],
      crs: { code: 1 },
      accuracy: 1,
      roi: '000000000000000000000001',
      area: 1,
    },
    weather: { temperature: 1, sky: { code: 1 }, wind: 1 },
    details: {
      algae: { checked: true, extension: { code: 1 }, look: { code: 1 }, colour: { code: 1 }, iridescent: true },
      foams: { checked: true, extension: { code: 1 }, look: { code: 1 }, height: { code: 1 } },
      oils: { checked: true, type: { code: 1 }, extension: { code: 1 } },
      litters: { checked: true, quantity: { code: 1 }, type: [{ code: 1 }, { code: 2 }] },
      odours: { checked: true, intensity: { code: 1 }, origin: [{ code: 1 }, { code: 2 }] },
      outlets: {
        checked: true,
        inPlace: false,
        terminal: { code: 1 },
        colour: { code: 1 },
        vapour: true,
        signage: true,
        prodActNearby: true,
        prodActNearbyDetails: 'foo',
      },
      fauna: {
        checked: true,
        fish: {
          checked: true,
          number: 1,
          deceased: true,
          abnormal: { checked: true, details: 'foo' },
          alien: { checked: true, species: [{ code: 1 }] },
        },
        birds: {
          checked: true,
          number: 1,
          deceased: true,
          abnormal: { checked: true, details: 'foo' },
          alien: { checked: true, species: [{ code: 1 }] },
        },
        molluscs: {
          checked: true,
          number: 1,
          deceased: true,
          abnormal: { checked: true, details: 'foo' },
          alien: { checked: true, species: [{ code: 1 }] },
        },
        crustaceans: {
          checked: true,
          number: 1,
          deceased: true,
          abnormal: { checked: true, details: 'foo' },
          alien: { checked: true, species: [{ code: 1 }] },
        },
        turtles: {
          checked: true,
          number: 1,
          deceased: true,
          abnormal: { checked: true, details: 'foo' },
          alien: { checked: true, species: [{ code: 1 }] },
        },
      },
    },
    measures: {
      transparency: { val: 1, instrument: { type: { code: 1 }, precision: 1, details: 'foo' } },
      temperature: {
        multiple: true,
        val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
        instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
      },
      ph: {
        multiple: true,
        val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
        instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
      },
      oxygen: {
        multiple: true,
        percentage: true,
        val: [{ depth: 0, val: 1 }, { depth: 1, val: 2 }],
        instrument: { type: { code: 1 }, precision: 1, details: 'foo' },
      },
      bacteria: { escherichiaColi: 1, enterococci: 1 },
    },
    other: 'Complete observation of user demo1',
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c2a46',
    position: {
      type: 'Point',
      coordinates: [8.572928, 45.932513],
      crs: { code: 1 },
      roi: '000000000000000000000002',
      area: 2,
    },
    weather: { sky: { code: 1 } },
    other: 'Old observation of user demo1',
    markedForDeletion: false,
    createdAt: moment().subtract(2, 'months').toISOString(),
  },
  {
    uid: '5dd7bbe0701d5bdd685c2a46',
    position: {
      type: 'Point',
      coordinates: [8.970187, 45.922071],
      crs: { code: 1 },
      roi: '000000000000000000000005',
      area: 3,
    },
    weather: { sky: { code: 1 } },
    other: 'Very old observation of user demo1',
    markedForDeletion: false,
    createdAt: moment().subtract(11, 'months').toISOString(),
  },
  {
    uid: '5dd7bbe0701d5bdd685c2a47',
    callId: 1234,
    position: {
      type: 'Point',
      coordinates: [8.699567, 45.971721],
      crs: { code: 1 },
      accuracy: 1,
      roi: '000000000000000000000008',
      area: 1,
    },
    weather: { temperature: 1, sky: { code: 1 }, wind: 1 },
    details: {
      foams: { checked: true, extension: { code: 1 } },
      odours: { checked: true, intensity: { code: 1 }, origin: [{ code: 1 }, { code: 2 }] },
      fauna: {
        checked: true,
        fish: { checked: true, number: 1 },
      },
    },
    measures: {
      temperature: {
        multiple: false,
        val: [{ depth: 0, val: 1 }],
        instrument: { type: { code: 1 }, precision: 1 },
      },
    },
    other: 'New observation of user demo2',
    markedForDeletion: false,
  },
  {
    uid: '5dd7bbe0701d5bdd685c2a47',
    position: {
      type: 'Point',
      coordinates: [9.183979, 45.967102],
      crs: { code: 1 },
      roi: '000000000000000000000001',
      area: 1,
    },
    weather: { sky: { code: 1 } },
    other: 'Old observation of user demo2',
    markedForDeletion: false,
    createdAt: moment().subtract(3, 'months').toISOString(),
  },
]
