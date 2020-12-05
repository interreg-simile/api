'use strict'

const multer = require('multer')
const uuid = require('uuid/v4')

const { CustomError } = require('../lib/CustomError')

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
      request.log.error(`File type ${file.mimetype} not supported`)
      callback(new CustomError(415))
      return
    }

    callback(null, true)
  }

  const upload = multer({ storage, fileFilter }).fields(fields)

  const callback = error => {
    if (error) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        req.log.error(error, `Max number of ${req.config.upload.max} file(s) exceeded`)
        throw new CustomError(422, 'Too many files', 'FileUploadException')
      }

      req.log.error(error, 'Error uploading files')
      throw new CustomError(500, 'Error uploading files')
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
      req.log.error(error, `Min number of ${error.min} file(s) not reached`)
      throw new CustomError(422, 'Too few files', 'FileUploadException')
    }

    next()
  }

  upload(req, res, error => callback(error))
}
