'use strict'

const { Router } = require('express')

const { parseRequiredToken } = require('../../middlewares/parseAuthToken')
const checkValidation = require('../../middlewares/checkValidation')
const checkPaternity = require('../../middlewares/checkPaternity')
const validator = require('./users.validator')
const controller = require('./users.controller')

const router = Router()

router.get('/:id', parseRequiredToken, checkPaternity, validator.getById, checkValidation, controller.getById)
router.patch('/:id/change-email', parseRequiredToken, checkPaternity, validator.changeEmail, checkValidation, controller.changeEmail)
router.patch('/:id/change-password', parseRequiredToken, checkPaternity, validator.changePassword, checkValidation, controller.changePassword)
router.patch('/:id/change-info', parseRequiredToken, checkPaternity, validator.changeInfo, checkValidation, controller.changeInfo)
router.delete('/:id', parseRequiredToken, checkPaternity, validator.deleteById, checkValidation, controller.deleteById)

module.exports = { router }
