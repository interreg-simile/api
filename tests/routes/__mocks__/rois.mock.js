'use strict'

const { model: roisModel } = require('../../../modules/rois/rois.model')

const data = [
  {
    country: { code: 1 },
    area: { code: 1 },
    lake: { code: 1 },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [
            9.138221740722656,
            45.48492845141098,
          ],
          [
            9.127235412597656,
            45.46639130966522,
          ],
          [
            9.167747497558594,
            45.47939202177826,
          ],
          [
            9.138221740722656,
            45.48492845141098,
          ],
        ],
      ],
    },
  },
  {
    country: { code: 2 },
    area: { code: 2 },
    lake: { code: 2 },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [
            9.315719604492188,
            45.4947963896697,
          ],
          [
            9.340438842773436,
            45.51693278828882,
          ],
          [
            9.294776916503906,
            45.51115891482306,
          ],
          [
            9.315719604492188,
            45.4947963896697,
          ],
        ],
      ],
    },
  },
  {
    country: { code: 2 },
    area: { code: 3 },
    lake: { code: 3 },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [
            9.26971435546875,
            45.40351225590908,
          ],
          [
            9.258041381835938,
            45.41869637328527,
          ],
          [
            9.221649169921875,
            45.40399435412046,
          ],
          [
            9.26971435546875,
            45.40351225590908,
          ],
        ],
      ],
    },
  },
]

async function seed() {
  await roisModel.create(data)
}

module.exports = { data, seed }
