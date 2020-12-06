'use strict'

const { Router } = require('express')
const controller = require('./rois.controller')

const router = Router()

router.get('', controller.getAll)

module.exports = { router }
