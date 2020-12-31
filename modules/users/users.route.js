'use strict'

const { Router } = require('express')

const checkToken = require('../../middlewares/checkToken')
const checkValidation = require('../../middlewares/checkValidation')
const checkPaternity = require('../../middlewares/checkPaternity')
const validator = require('./users.validator')
const controller = require('./users.controller')

const router = Router()

router.get('/:id', checkToken, checkPaternity, validator.getById, checkValidation, controller.getById)
router.patch('/:id/change-email', checkToken, checkPaternity, validator.changeEmail, checkValidation, controller.changeEmail)
router.patch('/:id/change-password', checkToken, checkPaternity, validator.changePassword, checkValidation, controller.changePassword)
router.patch('/:id/change-info', checkToken, checkPaternity, validator.changeInfo, checkValidation, controller.changeInfo)
router.delete('/:id', checkToken, checkPaternity, validator.deleteById, checkValidation, controller.deleteById)

module.exports = { router }
