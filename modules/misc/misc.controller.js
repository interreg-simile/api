'use strict'

const { OPEN_WEATHER_KEY } = process.env
const service = require('./misc.service')
const { CustomError } = require('../../lib/CustomError')

async function getWeather(req, res, next) {
  const { lat, lon } = req.query

  const query = {
    lat,
    lon,
    appid: OPEN_WEATHER_KEY,
    lang: req.lng,
    units: 'metric',
  }

  try {
    const data = await service.getWeather(query, req.log)
    res.status(200).json({ meta: { code: 200 }, data })
  } catch (error) {
    req.log.error({ error, query }, 'Error retrieving weather data')
    return next(new CustomError(500, error.message))
  }
}

module.exports = { getWeather }
