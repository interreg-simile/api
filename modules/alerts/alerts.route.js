'use strict'

const { Router } = require('express')

const checkValidation = require('../../lib/checkValidation')
const validator = require('./alerts.validator')
const controller = require('./alerts.controller')

const router = Router()

router.get('', validator.getAll, checkValidation, controller.getAll)
router.get('/:id', validator.getById, checkValidation, controller.getById)

module.exports = { router }
