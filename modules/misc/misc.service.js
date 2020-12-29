'use strict'

const fetch = require('node-fetch')

async function getWeather(query, logger) {
  let url = 'https://api.openweathermap.org/data/2.5/weather?'

  Object.keys(query).forEach(queryKey => {
    url += `${queryKey}=${query[queryKey]}&`
  })
  url = url.slice(0, -1)

  let response, data
  try {
    response = await fetch(url)
    data = await response.json()
  } catch (error) {
    logger.error(error.message)
    throw new Error('Error calling OpenWeatherMap')
  }

  if (!response.ok) {
    logger.error(data)
    throw new Error('Error calling OpenWeatherMap')
  }

  let skyCode = 1
  if (data.weather[0].id >= 200 && data.weather[0].id < 600) {
    skyCode = 4
  } else if (data.weather[0].id >= 600 && data.weather[0].id < 700) {
    skyCode = 5
  } else if (data.weather[0].id >= 700 && data.weather[0].id < 800) {
    skyCode = 6
  } else if (data.weather[0].id === 801) {
    skyCode = 2
  } else if (data.weather[0].id > 801) {
    skyCode = 3
  }

  return { sky: skyCode, temperature: data.main.temp, wind: data.wind.speed }
}

module.exports = { getWeather }
