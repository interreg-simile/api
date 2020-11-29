'use strict'

const multer = require('multer')
const uuid = require('uuid/v4')

const constructError = require('../lib/constructError')

module.exports = (req, res, next) => {
  if (!req.config.upload) {
    next()
    return
  }

  const storage = multer.diskStorage({
    destination: (request, file, callback) => callback(null, request.config.upload.dest),
    filename: (request, file, callback) => callback(null, `${uuid()}.${file.mimetype.split('/')[1]}`),
  })

  const fields = req.config.upload.fields.map(field => ({ name: field.name, maxCount: field.max }))

  const fileFilter = (request, file, callback) => {
    if (!(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')) {
      callback(constructError(415))
      return
    }

    callback(null, true)
  }

  const upload = multer({ storage, fileFilter }).fields(fields)

  const callback = error => {
    if (error) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        next(constructError(
          422,
          `messages.tooManyFiles;{"max": "${req.config.upload.max}", "field": "${error.field}" }`,
          'types.fileUploadException')
        )
        return
      }

      next(constructError(500, '', 'types.fileUploadException'))
      return
    }

    let tooFewFilesField
    req.config.upload.fields.some(field => {
      if (field.min === 0) {
        return false
      }

      if ((!req.files || !Object.keys(req.files).includes(field.name)) || req.files[field.name].length < field.min) {
        tooFewFilesField = field
        return true
      }

      return false
    })

    if (tooFewFilesField) {
      next(constructError(
        422,
        `messages.tooFewFiles;{ "min": "${error.min}", "field": "${error.name}" }`,
        'types.fileUploadException'
      ))

      return
    }

    next()
  }

  upload(req, res, error => callback(error))
}
