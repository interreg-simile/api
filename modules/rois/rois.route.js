'use strict'

const { Router } = require('express')

const checkValidation = require('../../lib/checkValidation')
const validator = require('./rois.validator')
const controller = require('./rois.controller')

const router = Router()

router.get('', validator.getAll, checkValidation, controller.getAll)

module.exports = { router }
