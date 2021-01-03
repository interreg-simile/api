'use strict'

const { Router } = require('express')

const uploadFiles = require('../../middlewares/uploadFiles')
const parseFormdata = require('../../middlewares/parseFormdata')
const { parseOptionalToken } = require('../../middlewares/parseAuthToken')
const checkValidation = require('../../middlewares/checkValidation')
const validator = require('./observations.validator')
const controller = require('./observations.controller')

const router = Router()

router.get('/', validator.getAll, checkValidation, controller.getAll)
router.get('/:id', validator.getById, checkValidation, controller.getById)

const multerFields = [{ name: 'photos', maxCount: 3 }, { name: 'signage', maxCount: 1 }]
router.post(
  '/',
  uploadFiles(multerFields),
  parseFormdata,
  parseOptionalToken,
  validator.create,
  checkValidation,
  controller.create
)

module.exports = { router }
