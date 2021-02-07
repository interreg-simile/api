'use strict'

const { Router } = require('express')

const checkValidation = require('../../middlewares/checkValidation')
const validator = require('./auth.validator')
const controller = require('./auth.controller')

const router = Router()

router.post('/register', validator.register, checkValidation, controller.register)
router.post('/login', validator.login, checkValidation, controller.login)
router.post('/send-confirmation-email', validator.sendConfirmationEmail, checkValidation, controller.sendConfirmationEmail)
router.get('/confirm-email', validator.confirmEmail, controller.confirmEmail)

module.exports = { router }
