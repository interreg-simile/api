'use strict'

const { Router } = require('express')

const checkValidation = require('../../middlewares/checkValidation')
const validator = require('./auth.validator')
const controller = require('./auth.controller')

const router = Router()

router.post('/register', validator.register, checkValidation, controller.register)
router.post('/login', validator.login, checkValidation, controller.login)

module.exports = { router }
