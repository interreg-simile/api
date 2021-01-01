'use strict'

const { Router } = require('express')

const { parseOptionalToken } = require('../../middlewares/parseAuthToken')
const checkValidation = require('../../middlewares/checkValidation')
const validator = require('./observations.validator')
const controller = require('./observations.controller')

const router = Router()

router.get('/', validator.getAll, checkValidation, controller.getAll)
router.get('/:id', validator.getById, checkValidation, controller.getById)
router.post('/', parseOptionalToken, validator.create, checkValidation, controller.create)

module.exports = { router }
