'use strict'

const { Router } = require('express')

const checkValidation = require('../../middlewares/checkValidation')
const validator = require('./events.validator')
const controller = require('./events.controller')

const router = Router()

router.get('/', validator.getAll, checkValidation, controller.getAll)
router.get('/:id', validator.getById, checkValidation, controller.getById)

module.exports = { router }
