/* eslint-disable newline-per-chained-call */
'use strict'

const { model: observationsModel } = require('../../../modules/observations/observations.model')

const data = [
  {
    _id: '111111111111111111111111',
    uid: '5dd7bbe0701d5bdd685c1f10',
    callId: 1234,
    position: {
      type: 'Point',
      coordinates: [9.386683, 45.855060],
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
        signagePhoto: 'bar.jpg',
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
    other: 'foo',
    photos: ['foo.jpg'],
    markedForDeletion: false,
    createdAt: '2020-01-01T00:00:00.000Z',
  },
  {
    _id: '222222222222222222222222',
    uid: '5dd7bbe0701d5bdd685c1f10',
    position: {
      type: 'Point',
      coordinates: [9.386683, 45.855060],
      crs: { code: 1 },
    },
    weather: { sky: { code: 1 } },
    markedForDeletion: false,
  },
  {
    _id: '333333333333333333333333',
    uid: '5dd7bbe0701d5bdd685c1f10',
    position: {
      type: 'Point',
      coordinates: [9.386683, 45.855060],
      crs: { code: 1 },
    },
    weather: { sky: { code: 1 } },
    markedForDeletion: true,
  },
]

async function seed() {
  await observationsModel.create(data)
}

module.exports = { data, seed }
