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

async function getAllLinks(req, res, next) {
  const options = {
    sort: { order: 1 },
  }

  try {
    const links = await service.getAllLinks({}, {}, options)
    res.status(200).json({ meta: { code: 200 }, data: links })
  } catch (error) {
    req.log.error({ error, options }, 'Error retrieving links')
    return next(new CustomError(500, error.message))
  }
}

async function getAllContacts(req, res, next) {
  const { area } = req.query

  const query = { ...(area && { area }) }

  try {
    const contacts = await service.getAllContacts(query, {}, {})
    res.status(200).json({ meta: { code: 200 }, data: contacts })
  } catch (error) {
    req.log.error({ error, query }, 'Error retrieving authority contacts')
    return next(new CustomError(500, error.message))
  }
}

module.exports = { getWeather, getAllLinks, getAllContacts }
