'use strict'

const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { CustomError } = require('../lib/CustomError')

const { UPLOAD_PATH } = process.env

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, UPLOAD_PATH),
  filename: (req, file, callback) => callback(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`),
})

function fileFilter(req, file, callback) {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true)
    return
  }

  req.log.error({ name: file.originalname, type: file.mimetype }, 'File type not supported')
  callback(new CustomError(415, `File ${file.originalname} has unsupported type ${file.mimetype}`))
}

// See https://github.com/expressjs/multer#readme for the format of parameter 'fields'
module.exports = (fields) => {
  return (req, res, next) => {
    if (!req.is('multipart/form-data')) {
      throw new CustomError(415, 'Request must be multipart/form-data')
    }

    const upload = multer({ storage, fileFilter }).fields(fields)

    upload(req, res, error => {
      if (!error) {
        return next()
      }

      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        req.log.error(error, `Too many files`)
        return next(new CustomError(422, 'Too many files'))
      }

      req.log.error(error, 'Error uploading files')
      return next(error instanceof CustomError ? error : new CustomError(500, 'Error uploading files'))
    })
  }
}
