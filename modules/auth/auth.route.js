'use strict'

const { Router } = require('express')

const checkValidation = require('../../middlewares/checkValidation')
const validator = require('./auth.validator')
const controller = require('./auth.controller')

const router = Router()

router.post('/register', validator.register, checkValidation, controller.register)
router.post('/login', validator.login, checkValidation, controller.login)
router.get('/confirm-email', (req, res, next) => {
  // const { email, token } = req.query
  res.status(201).json({ success: 'true' })
})

module.exports = { router }
