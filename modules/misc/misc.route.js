'use strict'

const { Router } = require('express')

const checkValidation = require('../../middlewares/checkValidation')
const validator = require('./misc.validator')
const controller = require('./misc.controller')

const router = Router()

router.get('/weather', validator.getWeather, checkValidation, controller.getWeather)

module.exports = { router }
